const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/courts', require('./routes/courts'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/data', require('./routes/data')); // Keep for backward compatibility

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuickCourt API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      facilities: '/api/facilities',
      courts: '/api/courts',
      bookings: '/api/bookings',
      users: '/api/users'
    },
    demoAccounts: {
      user: { email: 'user1@demo.com', password: '123456' },
      facilityOwner: { email: 'owner1@demo.com', password: '123456' },
      admin: { email: 'admin1@demo.com', password: '123456' }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`QuickCourt server is running on port ${PORT}`);
  console.log(`\nDemo Accounts:`);
  console.log(`User: user1@demo.com / 123456`);
  console.log(`Facility Owner: owner1@demo.com / 123456`);
  console.log(`Admin: admin1@demo.com / 123456`);
});
