const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Dummy users for demo only
const dummyUsers = [
  {
    email: 'user1@demo.com',
    password: '123456',
    name: 'John Doe',
    role: 'user'
  },
  {
    email: 'owner1@demo.com',
    password: '123456',
    name: 'Facility Owner',
    role: 'facility_owner'
  },
  {
    email: 'admin1@demo.com',
    password: '123456',
    name: 'Admin User',
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
        console.log(`Demo user created: ${dummyUser.name} (${dummyUser.email})`);
      }
    }
  } catch (error) {
    console.error('Error initializing dummy users:', error);
  }
};

// Call this function when the module is loaded
initializeDummyUsers();

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
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if this is a demo account
    const demoUser = dummyUsers.find(user => user.email === email);
    if (!demoUser || password !== demoUser.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials. Please use demo accounts only.' 
      });
    }

    // Find the demo user in database
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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

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
    console.error('Login error:', err);
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
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
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
// @desc     Logout user (just for frontend, JWT is stateless)
// @access   Public
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Export available demo users for reference
router.get('/demo-users', (req, res) => {
  const demoUsersList = dummyUsers.map(user => ({
    email: user.email,
    password: user.password,
    name: user.name,
    role: user.role
  }));
  
  res.json({
    success: true,
    message: 'Available demo users',
    users: demoUsersList
  });
});

module.exports = router;
