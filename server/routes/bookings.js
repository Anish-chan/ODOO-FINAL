const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Facility = require('../models/Facility');

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.userId };
    if (status) {
      query.status = status;
    }
    
    const bookings = await Booking.find(query)
      .populate('facility', 'name address photos')
      .populate('court', 'name sportType')
      .sort({ date: -1, startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get facility owner's bookings
router.get('/facility-bookings', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Get all facilities owned by the user
    const facilities = await Facility.find({ owner: req.userId }).select('_id');
    const facilityIds = facilities.map(f => f._id);
    
    let query = { facility: { $in: facilityIds } };
    if (status) {
      query.status = status;
    }
    
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('facility', 'name')
      .populate('court', 'name sportType')
      .sort({ date: -1, startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { courtId, date, startTime, endTime, duration } = req.body;
    
    // Get court and facility details
    const court = await Court.findById(courtId).populate('facility');
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    // Check if facility is approved
    if (court.facility.status !== 'approved') {
      return res.status(400).json({ message: 'Facility not approved for bookings' });
    }
    
    // Check for existing bookings at the same time
    const existingBooking = await Booking.findOne({
      court: courtId,
      date: new Date(date),
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    // Check if slot is blocked
    const isBlocked = court.blockedSlots.some(slot => {
      const slotDate = new Date(slot.date).toDateString();
      const bookingDate = new Date(date).toDateString();
      return slotDate === bookingDate && 
             slot.startTime <= startTime && 
             slot.endTime >= endTime;
    });
    
    if (isBlocked) {
      return res.status(400).json({ message: 'Time slot is blocked for maintenance' });
    }
    
    // Calculate total price
    const totalPrice = court.pricePerHour * duration;
    
    const booking = new Booking({
      user: req.userId,
      facility: court.facility._id,
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      duration,
      totalPrice
    });
    
    await booking.save();
    await booking.populate([
      { path: 'facility', select: 'name address' },
      { path: 'court', select: 'name sportType' }
    ]);
    
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }
    
    // Check if booking is in the future
    const bookingDateTime = new Date(`${booking.date.toDateString()} ${booking.startTime}`);
    if (bookingDateTime <= new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }
    
    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by user';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots for a court on a specific date
router.get('/availability/:courtId/:date', async (req, res) => {
  try {
    const { courtId, date } = req.params;
    const court = await Court.findById(courtId).populate('facility');
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    // Get existing bookings for the date
    const existingBookings = await Booking.find({
      court: courtId,
      date: new Date(date),
      status: { $ne: 'cancelled' }
    }).select('startTime endTime');
    
    // Get blocked slots for the date
    const blockedSlots = court.blockedSlots.filter(slot => {
      const slotDate = new Date(slot.date).toDateString();
      const checkDate = new Date(date).toDateString();
      return slotDate === checkDate;
    });
    
    // Generate time slots (assuming 1-hour slots from 6 AM to 11 PM)
    const timeSlots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if slot is available
      const isBooked = existingBookings.some(booking => 
        booking.startTime <= startTime && booking.endTime > startTime
      );
      
      const isBlocked = blockedSlots.some(slot => 
        slot.startTime <= startTime && slot.endTime > startTime
      );
      
      timeSlots.push({
        startTime,
        endTime,
        available: !isBooked && !isBlocked,
        price: court.pricePerHour
      });
    }
    
    res.json(timeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all bookings
router.get('/admin/all', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('facility', 'name')
      .populate('court', 'name sportType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments();
    
    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
