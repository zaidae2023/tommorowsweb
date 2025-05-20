// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  avatar: { type: String },
  isGoogleUser: { type: Boolean, default: false },

  // Email verification fields
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
