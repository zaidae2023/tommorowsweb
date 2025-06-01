// Import mongoose to define schemas and interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for recording vehicle-related expenses
const expenseSchema = new mongoose.Schema({
  // Reference to the user who owns the expense
  userId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
    ref: 'User',                          // Linked to the 'User' model
    required: true,                       // Must be provided
  },

  // Reference to the vehicle the expense is for
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
    ref: 'Vehicle',                       // Linked to the 'Vehicle' model
    required: true,                       // Must be provided
  },

  // Type of expense (limited to predefined categories)
  type: {
    type: String,
    enum: ['Fuel', 'Repair', 'Insurance', 'Other'], // Allowed values only
    required: true,                                 // Must be provided
  },

  // Amount spent
  amount: {
    type: Number,
    required: true, // Must be provided
  },

  // Currency used for the expense
  currency: {
    type: String,
    default: 'USD', // Default is USD if not provided
  },

  // Date the expense occurred (defaults to current date/time)
  date: {
    type: Date,
    default: Date.now,
  },

  // Optional note about the expense
  note: {
    type: String,
  },
});

// Export the Expense model so it can be used in other files
module.exports = mongoose.model('Expense', expenseSchema);
