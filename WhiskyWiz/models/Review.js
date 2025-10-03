const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  whisky: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Whisky',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  nose: {
    type: Number,
    min: 1,
    max: 5
  },
  palate: {
    type: Number,
    min: 1,
    max: 5
  },
  finish: {
    type: Number,
    min: 1,
    max: 5
  },
  value: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);