const express = require('express');
const router = express.Router();
const Whisky = require('../models/Whisky');

// Get all whiskies with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const whiskies = await Whisky.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });
    
    const total = await Whisky.countDocuments();
    
    res.json({
      whiskies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get whisky by ID
router.get('/:id', async (req, res) => {
  try {
    const whisky = await Whisky.findById(req.params.id);
    
    if (!whisky) {
      return res.status(404).json({ message: 'Whisky not found' });
    }
    
    res.json(whisky);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search whiskies
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const whiskies = await Whisky.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { distillery: { $regex: searchQuery, $options: 'i' } },
        { region: { $regex: searchQuery, $options: 'i' } },
        { country: { $regex: searchQuery, $options: 'i' } }
      ]
    }).limit(20);
    
    res.json(whiskies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new whisky
router.post('/', async (req, res) => {
  try {
    const newWhisky = new Whisky(req.body);
    const whisky = await newWhisky.save();
    res.status(201).json(whisky);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update whisky
router.put('/:id', async (req, res) => {
  try {
    const whisky = await Whisky.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!whisky) {
      return res.status(404).json({ message: 'Whisky not found' });
    }
    
    res.json(whisky);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete whisky
router.delete('/:id', async (req, res) => {
  try {
    const whisky = await Whisky.findByIdAndDelete(req.params.id);
    
    if (!whisky) {
      return res.status(404).json({ message: 'Whisky not found' });
    }
    
    res.json({ message: 'Whisky removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;