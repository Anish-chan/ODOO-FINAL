const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'facility_owner', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: true // Set to true for demo purposes
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
