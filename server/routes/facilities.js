const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
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
    
    const facility = new Facility(facilityData);
    await facility.save();
    
    res.status(201).json(facility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
    
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' }, // Reset to pending after updates
      { new: true }
    );
    
    res.json(updatedFacility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
router.get('/admin/all', auth, checkRole(['admin']), async (req, res) => {
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

router.get('/admin/pending', auth, checkRole(['admin']), async (req, res) => {
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

router.patch('/admin/:id/approve', auth, checkRole(['admin']), async (req, res) => {
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

module.exports = router;
