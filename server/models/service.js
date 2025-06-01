// Import mongoose to define the schema and work with MongoDB
const mongoose = require('mongoose');

// Define the schema for a vehicle service entry
const serviceSchema = new mongoose.Schema({
  // Reference to the user who scheduled the service
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
    ref: 'User',                          // References the 'User' model
    required: true                        // Must be provided
  },

  // Reference to the vehicle that needs service
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
    ref: 'Vehicle',                       // References the 'Vehicle' model
    required: true                        // Must be provided
  },

  // Type of service (e.g., Oil Change, Tire Rotation)
  type: { 
    type: String, 
    required: true                        // Must be provided
  },

  // Date the service is scheduled or completed
  date: { 
    type: Date, 
    required: true                        // Must be provided
  },

  // Optional note or remark about the service
  note: { 
    type: String 
  },

  // Status of the service (upcoming, completed, or missed)
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed'], // Only these values are allowed
    default: 'upcoming'                        // Default status is "upcoming"
  },
});

// Export the model to use it in other parts of the application
module.exports = mongoose.model('Service', serviceSchema);
