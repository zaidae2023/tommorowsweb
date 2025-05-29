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
  otpExpiry: { type: Date },

  // ✅ Subscription plan and usage tracking
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  exportsUsed: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
