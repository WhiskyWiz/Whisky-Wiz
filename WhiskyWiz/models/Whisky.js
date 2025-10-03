const mongoose = require('mongoose');

const WhiskySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  distillery: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Single Malt', 'Blended Malt', 'Blended', 'Bourbon', 'Rye', 'Irish', 'Japanese', 'Other'],
    default: 'Single Malt'
  },
  age: {
    type: Number,
    min: 0
  },
  abv: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  bottler: {
    type: String,
    trim: true
  },
  caskType: [String],
  color: String,
  nose: String,
  palate: String,
  finish: String,
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  limited: {
    type: Boolean,
    default: false
  },
  discontinued: {
    type: Boolean,
    default: false
  },
  releaseYear: Number,
  bottleSize: {
    type: Number,
    default: 700 // in ml
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Whisky', WhiskySchema);