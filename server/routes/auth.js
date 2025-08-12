const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Demo users only
const demoUsers = [
  {
    email: 'user1@demo.com',
    password: '123456',
    name: 'Demo User',
    role: 'user'
  },
  {
    email: 'owner1@demo.com',
    password: '123456',
    name: 'Demo Facility Owner',
    role: 'facility_owner'
  },
  {
    email: 'admin1@demo.com',
    password: '123456',
    name: 'Demo Admin',
    role: 'admin'
  }
];

// Initialize demo users on server start
const initializeDemoUsers = async () => {
  try {
    for (const demoUser of demoUsers) {
      const existingUser = await User.findOne({ email: demoUser.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoUser.password, salt);
        
        const user = new User({
          name: demoUser.name,
          email: demoUser.email,
          password: hashedPassword,
          role: demoUser.role
        });
        
        await user.save();
        console.log(`Demo user created: ${demoUser.email}`);
      }
    }
  } catch (err) {
    console.error('Error initializing demo users:', err);
  }
};

// Call this when the module is loaded
initializeDemoUsers();

// @route    POST /api/auth/login
// @desc     Login user (demo only)
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
        message: 'Please enter valid credentials' 
      });
    }

    const { email, password } = req.body;

    // Find user in database first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if it's a demo user (plain text password)
    const demoUser = demoUsers.find(demoUser => demoUser.email === email);
    let isPasswordValid = false;

    if (demoUser && password === demoUser.password) {
      // Demo user with plain text password
      isPasswordValid = true;
    } else {
      // Regular user with hashed password
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
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
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route    POST /api/auth/register
// @desc     Register new user
// @access   Public
router.post('/register', [
  body('name', 'Name is required').not().isEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('role', 'Role is required').isIn(['user', 'facility_owner'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please check your input data',
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'user',
      phone
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route    GET /api/auth/user
// @desc     Get user by token
// @access   Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route    POST /api/auth/logout
// @desc     Logout user (client-side only)
// @access   Public
router.post('/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

module.exports = router;
