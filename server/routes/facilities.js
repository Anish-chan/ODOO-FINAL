const express = require('express');
const { auth, checkRole, checkRoleOrDemoOwner } = require('../middleware/auth');
const Facility = require('../models/Facility');
const Court = require('../models/Court');
const Review = require('../models/Data'); // Using the renamed Review model

const router = express.Router();

// Get all approved facilities (public)
router.get('/', async (req, res) => {
  try {
    const { sport, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'approved' };
    
    if (sport) {
      query.sportsSupported = { $in: [sport] };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    const facilities = await Facility.find(query)
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'rating.average': -1 });
    
    // Get courts and pricing for each facility
    const facilitiesWithPricing = await Promise.all(
      facilities.map(async (facility) => {
        const courts = await Court.find({ facility: facility._id, isActive: true });
        const minPrice = courts.length > 0 ? Math.min(...courts.map(c => c.pricePerHour)) : 0;
        
        return {
          ...facility.toObject(),
          courts: courts.length,
          startingPrice: minPrice
        };
      })
    );
    
    const total = await Facility.countDocuments(query);
    
    res.json({
      facilities: facilitiesWithPricing,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single facility by ID
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    // Get courts for this facility
    const courts = await Court.find({ facility: facility._id, isActive: true });
    
    // Get reviews for this facility
    const reviews = await Review.find({ facility: facility._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      ...facility.toObject(),
      courts,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new facility (Facility Owner only)
router.post('/', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const facilityData = {
      ...req.body,
      owner: req.userId,
      status: 'pending'
    };
    
    // Process photos if they exist
    if (facilityData.photos && Array.isArray(facilityData.photos)) {
      facilityData.photos = facilityData.photos.map(photo => {
        if (typeof photo === 'string') {
          return { url: photo, caption: '' };
        }
        return photo;
      });
    }
    
    const facility = new Facility(facilityData);
    await facility.save();
    
    res.status(201).json(facility);
  } catch (error) {
    console.error('Create facility error:', error);
    
    // Better error handling
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Facility with this name already exists' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Update facility (Facility Owner only)
router.put('/:id', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    if (facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Process photos if they exist
    const updateData = { ...req.body };
    if (updateData.photos && Array.isArray(updateData.photos)) {
      // Convert photo URLs to the expected format
      updateData.photos = updateData.photos.map(photo => {
        if (typeof photo === 'string') {
          return { url: photo, caption: '' };
        }
        return photo;
      });
    }

    // Reset status to pending after updates
    updateData.status = 'pending';
    
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedFacility);
  } catch (error) {
    console.error('Update facility error:', error);
    
    // Better error handling
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Delete facility (Facility Owner only)
router.delete('/:id', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    if (facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get facilities by owner
router.get('/owner/my-facilities', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const facilities = await Facility.find({ owner: req.userId })
      .sort({ createdAt: -1 });
    
    const facilitiesWithStats = await Promise.all(
      facilities.map(async (facility) => {
        const courts = await Court.find({ facility: facility._id });
        return {
          ...facility.toObject(),
          totalCourts: courts.length,
          activeCourts: courts.filter(c => c.isActive).length
        };
      })
    );
    
    res.json(facilitiesWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes for facility approval
router.get('/admin/all', auth, checkRoleOrDemoOwner(['admin']), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const facilities = await Facility.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ facilities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/pending', auth, checkRoleOrDemoOwner(['admin']), async (req, res) => {
  try {
    const pendingFacilities = await Facility.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(pendingFacilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/admin/:id/approve', auth, checkRoleOrDemoOwner(['admin']), async (req, res) => {
  try {
    const { status, comments } = req.body;
    
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminComments: comments || ''
      },
      { new: true }
    ).populate('owner', 'name email');
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    res.json(facility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create facility on behalf of any owner
router.post('/admin/create', auth, checkRoleOrDemoOwner(['admin', 'facility_owner']), async (req, res) => {
  try {
    const facilityData = {
      ...req.body,
      owner: req.body.owner || req.userId, // Use provided owner or current user
      status: req.body.status || 'approved' // Admin can set status directly
    };
    
    const facility = new Facility(facilityData);
    await facility.save();
    
    res.status(201).json(facility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update any facility
router.put('/admin/:id/update', auth, checkRoleOrDemoOwner(['admin', 'facility_owner']), async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    // Admin can update any facility, facility_owner can only update their own
    if (req.userRole !== 'admin' && facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    
    res.json(updatedFacility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete any facility
router.delete('/admin/:id/delete', auth, checkRoleOrDemoOwner(['admin', 'facility_owner']), async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    // Admin can delete any facility, facility_owner can only delete their own
    if (req.userRole !== 'admin' && facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
