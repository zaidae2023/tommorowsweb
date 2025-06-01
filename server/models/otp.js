// Import mongoose to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for storing OTP (One-Time Password) data
const otpSchema = new mongoose.Schema({
  // Email address the OTP is associated with
  email: String,

  // The OTP code sent to the user
  code: String,

  // Timestamp when the OTP was created
  // `expires: 300` means the document will automatically be deleted after 5 minutes (300 seconds)
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // MongoDB TTL (Time-To-Live) index for auto-deletion
  }
});

// Export the model so it can be used to save and retrieve OTPs
module.exports = mongoose.model('Otp', otpSchema);
