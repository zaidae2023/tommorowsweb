// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  avatar: { type: String },
  isGoogleUser: { type: Boolean, default: false },

  // Email verification
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },

  // ✅ 2FA support
  twoFactorEnabled: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
