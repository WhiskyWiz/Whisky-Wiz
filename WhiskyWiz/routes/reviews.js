const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Whisky = require('../models/Whisky');

// Get all reviews for a whisky
router.get('/whisky/:whiskyId', async (req, res) => {
  try {
    const reviews = await Review.find({ whisky: req.params.whiskyId })
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const review = await newReview.save();
    
    // Update whisky average rating
    const whiskyId = req.body.whisky;
    const allReviews = await Review.find({ whisky: whiskyId });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await Whisky.findByIdAndUpdate(whiskyId, { 
      averageRating: averageRating.toFixed(1),
      totalReviews: allReviews.length
    });
    
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Update whisky average rating
    const whiskyId = review.whisky;
    const allReviews = await Review.find({ whisky: whiskyId });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await Whisky.findByIdAndUpdate(whiskyId, { 
      averageRating: averageRating.toFixed(1),
      totalReviews: allReviews.length
    });
    
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    // Update whisky average rating
    const whiskyId = review.whisky;
    const allReviews = await Review.find({ whisky: whiskyId });
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / allReviews.length;
      
      await Whisky.findByIdAndUpdate(whiskyId, { 
        averageRating: averageRating.toFixed(1),
        totalReviews: allReviews.length
      });
    } else {
      await Whisky.findByIdAndUpdate(whiskyId, { 
        averageRating: 0,
        totalReviews: 0
      });
    }
    
    res.json({ message: 'Review removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;