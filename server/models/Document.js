// Import mongoose to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for storing vehicle-related documents (like insurance, registration, etc.)
const documentSchema = new mongoose.Schema({
  // Reference to the user who uploaded the document
  userId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
    ref: 'User',                          // Linked to 'User' model
    required: true,                       // Must be provided
  },

  // Type of the document (must be one of the listed types)
  docType: {
    type: String,
    required: true, // Must be provided
    enum: ['Insurance', 'Registration', 'Pollution Certificate'], // Only these values are allowed
  },

  // URL or path to the uploaded file
  fileUrl: {
    type: String,
    required: true, // Must be provided
  },

  // Expiry date of the document (e.g., insurance expiry)
  expiryDate: {
    type: Date,
    required: true, // Must be provided
  },
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true
});

// Export the model so it can be used in other parts of the app
module.exports = mongoose.model('Document', documentSchema);
