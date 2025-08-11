const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const Court = require('../models/Court');
const Facility = require('../models/Facility');

const router = express.Router();

// Get courts for a specific facility
router.get('/facility/:facilityId', async (req, res) => {
  try {
    const courts = await Court.find({ 
      facility: req.params.facilityId,
      isActive: true 
    }).populate('facility', 'name');
    
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single court
router.get('/:id', async (req, res) => {
  try {
    const court = await Court.findById(req.params.id)
      .populate('facility', 'name address operatingHours');
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    res.json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new court (Facility Owner only)
router.post('/', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const { facilityId, ...courtData } = req.body;
    
    // Verify facility belongs to the owner
    const facility = await Facility.findById(facilityId);
    if (!facility || facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const court = new Court({
      ...courtData,
      facility: facilityId
    });
    
    await court.save();
    await court.populate('facility', 'name');
    
    res.status(201).json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update court (Facility Owner only)
router.put('/:id', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const court = await Court.findById(req.params.id).populate('facility');
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    if (court.facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedCourt = await Court.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('facility', 'name');
    
    res.json(updatedCourt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete court (Facility Owner only)
router.delete('/:id', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const court = await Court.findById(req.params.id).populate('facility');
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    if (court.facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Court.findByIdAndDelete(req.params.id);
    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courts by facility owner
router.get('/owner/my-courts', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const facilities = await Facility.find({ owner: req.userId }).select('_id');
    const facilityIds = facilities.map(f => f._id);
    
    const courts = await Court.find({ facility: { $in: facilityIds } })
      .populate('facility', 'name')
      .sort({ createdAt: -1 });
    
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Block time slots for maintenance
router.post('/:id/block-slots', auth, checkRole(['facility_owner']), async (req, res) => {
  try {
    const { date, startTime, endTime, reason } = req.body;
    const court = await Court.findById(req.params.id).populate('facility');
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    if (court.facility.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    court.blockedSlots.push({
      date: new Date(date),
      startTime,
      endTime,
      reason
    });
    
    await court.save();
    res.json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
