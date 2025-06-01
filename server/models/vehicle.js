// Import mongoose for working with MongoDB
const mongoose = require('mongoose');

// Define the schema for a vehicle document
const vehicleSchema = new mongoose.Schema({
  // Reference to the user who owns this vehicle
  userId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
    required: true,                       // Must be provided
    ref: 'User',                          // References the 'User' model
  },
  
  // VIN (Vehicle Identification Number)
  vin: {
    type: String,
    trim: true,               // Removes whitespace from both ends
    minlength: 17,            // Standard VIN length
    maxlength: 17,
    unique: true,             // Optional: ensures VIN is not repeated
    sparse: true,             // Allows null VINs without violating uniqueness
  },

  // Vehicle name (e.g., My Tesla)
  name: {
    type: String,
    required: true,           // Must be provided
    trim: true,               // Removes extra spaces
    minlength: 2,             // Minimum of 2 characters
    maxlength: 50,            // Max of 50 characters
  },

  // Model of the vehicle (e.g., Model 3)
  model: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },

  // Manufacturing year of the vehicle
  year: {
    type: Number,
    required: true,
    min: 1900,                          // Reasonable lower limit
    max: new Date().getFullYear() + 1, // Can add vehicles from next year
  },

  // Vehicle registration number (e.g., license plate)
  registration: {
    type: String,
    required: true,
    trim: true,
    unique: true,            // Must be unique across all vehicles
    maxlength: 20,
  },

  // Timestamp for when the vehicle was added
  createdAt: {
    type: Date,
    default: Date.now,       // Automatically sets current date/time
  },
});

// Export the model to use in other parts of the app
module.exports = mongoose.model('Vehicle', vehicleSchema);
