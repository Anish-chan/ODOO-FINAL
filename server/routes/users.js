const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Facility = require('../models/Facility');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, avatar },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats for different roles
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let stats = {};
    
    switch (user.role) {
      case 'user':
        const userBookings = await Booking.find({ user: req.userId });
        stats = {
          totalBookings: userBookings.length,
          confirmedBookings: userBookings.filter(b => b.status === 'confirmed').length,
          completedBookings: userBookings.filter(b => b.status === 'completed').length,
          cancelledBookings: userBookings.filter(b => b.status === 'cancelled').length,
          totalSpent: userBookings.reduce((sum, b) => sum + b.totalPrice, 0)
        };
        break;
        
      case 'facility_owner':
        const facilities = await Facility.find({ owner: req.userId });
        const facilityIds = facilities.map(f => f._id);
        const ownerBookings = await Booking.find({ facility: { $in: facilityIds } });
        
        stats = {
          totalFacilities: facilities.length,
          approvedFacilities: facilities.filter(f => f.status === 'approved').length,
          pendingFacilities: facilities.filter(f => f.status === 'pending').length,
          totalBookings: ownerBookings.length,
          totalEarnings: ownerBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0),
          thisMonthBookings: ownerBookings.filter(b => {
            const bookingDate = new Date(b.date);
            const now = new Date();
            return bookingDate.getMonth() === now.getMonth() && 
                   bookingDate.getFullYear() === now.getFullYear();
          }).length
        };
        break;
        
      case 'admin':
        const allUsers = await User.find();
        const allFacilities = await Facility.find();
        const allBookings = await Booking.find();
        
        stats = {
          totalUsers: allUsers.filter(u => u.role === 'user').length,
          totalFacilityOwners: allUsers.filter(u => u.role === 'facility_owner').length,
          totalAdmins: allUsers.filter(u => u.role === 'admin').length,
          totalFacilities: allFacilities.length,
          pendingApprovals: allFacilities.filter(f => f.status === 'pending').length,
          totalBookings: allBookings.length,
          totalRevenue: allBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0)
        };
        break;
    }
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
router.get('/admin/all-users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/admin/user/:id/status', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/user/:id/bookings', auth, checkRole(['admin']), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id })
      .populate('facility', 'name')
      .populate('court', 'name sportType')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
