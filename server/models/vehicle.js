const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  vin: {
    type: String,
    trim: true,
    minlength: 17,
    maxlength: 17,
    unique: true, // Optional: prevents duplicate VINs
    sparse: true, // Allows documents without a VIN
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  model: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  registration: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 20,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
