const express = require('express');
const router = express.Router();
const Price = require('../models/Price');

// Get all prices for a whisky
router.get('/whisky/:whiskyId', async (req, res) => {
  try {
    const prices = await Price.find({ whisky: req.params.whiskyId })
      .sort({ price: 1 });
    
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a price
router.post('/', async (req, res) => {
  try {
    const newPrice = new Price(req.body);
    const price = await newPrice.save();
    
    res.status(201).json(price);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a price
router.put('/:id', async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastChecked: Date.now() },
      { new: true }
    );
    
    if (!price) {
      return res.status(404).json({ message: 'Price not found' });
    }
    
    res.json(price);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a price
router.delete('/:id', async (req, res) => {
  try {
    const price = await Price.findByIdAndDelete(req.params.id);
    
    if (!price) {
      return res.status(404).json({ message: 'Price not found' });
    }
    
    res.json({ message: 'Price removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;