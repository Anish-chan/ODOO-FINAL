const express = require('express');
const { auth } = require('../middleware/auth');
const Data = require('../models/Data');

const router = express.Router();

// Get all data
router.get('/', auth, async (req, res) => {
  try {
    const data = await Data.find({ user: req.userId }).populate('user', 'name email');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new data
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newData = new Data({
      title,
      description,
      user: req.userId
    });

    const data = await newData.save();
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update data
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    let data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if user owns the data
    if (data.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    data = await Data.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete data
router.delete('/:id', auth, async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if user owns the data
    if (data.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Data.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
