const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const otpService = require('../utils/otpService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Dummy users for demo (keep existing functionality)
const dummyUsers = [
  {
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    role: 'user'
  },
  {
    email: 'owner@example.com',
    password: 'password123',
    name: 'Demo Facility Owner',
    role: 'facility_owner'
  },
  {
    email: 'admin@example.com',
    password: 'password123',
    name: 'Demo Admin',
    role: 'admin'
  }
];

// Initialize dummy users on server start
const initializeDummyUsers = async () => {
  try {
    for (const dummyUser of dummyUsers) {
      const existingUser = await User.findOne({ email: dummyUser.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dummyUser.password, salt);
        
        const user = new User({
          name: dummyUser.name,
          email: dummyUser.email,
          password: hashedPassword,
          role: dummyUser.role,
          isEmailVerified: true,
          status: 'active'
        });
        
        await user.save();
        console.log(`Dummy user created: ${dummyUser.email}`);
      }
    }
  } catch (error) {
    console.error('Error initializing dummy users:', error);
  }
};

// Call initialization
initializeDummyUsers();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

// @route    POST /api/auth/register
// @desc     Register user with OTP verification
// @access   Public
router.post('/register', [
  body('name', 'Name is required').not().isEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('phone', 'Please include a valid phone number').optional().isMobilePhone('en-IN'),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, phone, password, role = 'user' } = req.body;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or phone number' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email OTP
    const emailOTPData = otpService.generateOTPWithExpiry();

    // Create user
    user = new User({
      name,
      email,
      phone: phone || undefined,
      password: hashedPassword,
      role,
      emailOTP: emailOTPData,
      status: 'pending_verification'
    });

    await user.save();

    // Send email OTP
    const emailResult = await otpService.sendEmailOTP(email, emailOTPData.code, name);
    
    if (!emailResult.success) {
      await User.findByIdAndDelete(user._id); // Cleanup user if email fails
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email. Please try again.' 
      });
    }

    res.json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      userId: user._id,
      email: user.email
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route    POST /api/auth/verify-email
// @desc     Verify email OTP
// @access   Public
router.post('/verify-email', [
  body('email', 'Email is required').isEmail().normalizeEmail(),
  body('otp', 'OTP is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({ email, status: 'pending_verification' });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found or already verified' 
      });
    }

    // Check OTP attempts
    if (user.emailOTP.attempts >= 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    // Verify OTP
    const verification = otpService.verifyOTP(
      user.emailOTP.code, 
      otp, 
      user.emailOTP.expiresAt
    );

    if (!verification.valid) {
      // Increment attempts
      user.emailOTP.attempts += 1;
      await user.save();
      
      return res.status(400).json({ 
        success: false, 
        message: verification.reason,
        attemptsLeft: 3 - user.emailOTP.attempts
      });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.status = 'active';
    user.emailOTP = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during verification' 
    });
  }
});

// @route    POST /api/auth/resend-otp
// @desc     Resend OTP
// @access   Public
router.post('/resend-otp', [
  body('email', 'Email is required').isEmail().normalizeEmail(),
  body('type', 'OTP type is required').isIn(['email', 'phone'])
], async (req, res) => {
  try {
    const { email, type } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (type === 'email') {
      const emailOTPData = otpService.generateOTPWithExpiry();
      user.emailOTP = { ...emailOTPData, attempts: 0 };
      await user.save();

      const emailResult = await otpService.sendEmailOTP(email, emailOTPData.code, user.name);
      if (!emailResult.success) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to send email OTP' 
        });
      }

      res.json({
        success: true,
        message: 'Email OTP sent successfully!'
      });
    } else if (type === 'phone' && user.phone) {
      const phoneOTPData = otpService.generateOTPWithExpiry();
      user.phoneOTP = { ...phoneOTPData, attempts: 0 };
      await user.save();

      const smsResult = await otpService.sendSMSOTP(user.phone, phoneOTPData.code);
      if (!smsResult.success) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to send SMS OTP' 
        });
      }

      res.json({
        success: true,
        message: 'SMS OTP sent successfully!'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP type or phone number not provided' 
      });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while resending OTP' 
    });
  }
});

// @route    POST /api/auth/demo-login
// @desc     Demo login (for existing demo accounts)
// @access   Public
router.post('/demo-login', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if this is a demo account
    const demoUser = dummyUsers.find(user => user.email === email);
    if (!demoUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid demo credentials' 
      });
    }

    // For demo accounts, check password directly
    if (password !== demoUser.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid demo credentials' 
      });
    }

    // Find or create the demo user in database
    let user = await User.findOne({ email });
    if (!user) {
      // Create demo user if not exists
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({
        name: demoUser.name,
        email: demoUser.email,
        password: hashedPassword,
        role: demoUser.role,
        isEmailVerified: true,
        status: 'active'
      });
      
      await user.save();
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        status: user.status
      }
    });

  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during demo login' 
    });
  }
});

// @route    POST /api/auth/login
// @desc     Login user
// @access   Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if user is verified
    if (!user.isEmailVerified && user.status === 'pending_verification') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please verify your email first',
        requiresVerification: true,
        email: user.email
      });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been banned. Please contact support.' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// @route    GET /api/auth/me
// @desc     Get current user
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -emailOTP -phoneOTP -resetPassword');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route    POST /api/auth/logout
// @desc     Logout user
// @access   Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
});

module.exports = router;
