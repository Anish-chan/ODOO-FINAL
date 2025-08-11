const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  sportType: {
    type: String,
    required: true,
    enum: ['badminton', 'tennis', 'basketball', 'football', 'cricket', 'volleyball']
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  operatingHours: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  blockedSlots: [{
    date: Date,
    startTime: String,
    endTime: String,
    reason: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Court', courtSchema);
