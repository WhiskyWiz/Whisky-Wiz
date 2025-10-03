const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  whisky: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Whisky',
    required: true
  },
  retailer: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  url: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  country: {
    type: String,
    trim: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  regularPrice: {
    type: Number,
    min: 0
  }
});

module.exports = mongoose.model('Price', PriceSchema);