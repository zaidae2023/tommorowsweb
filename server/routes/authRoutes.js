const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/user');
const Otp = require('../models/otp');
const sendOtp = require('../utils/sendOtp');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// -------------------- Register with Email OTP --------------------
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      isVerified: false,
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, code });
    await sendOtp(email, code);

    res.status(200).json({ message: 'OTP sent to your email for verification.', email });
  } catch (err) {
    res.status(400).json({ message: 'Email already registered or invalid' });
  }
});

// -------------------- Verify OTP to Activate Account --------------------
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, code: otp });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email });

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// -------------------- Login with optional 2FA --------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  if (user.twoFactorEnabled) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtp(user.email, otp);
    return res.json({ requireOtp: true, email: user.email });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ message: 'Login successful', token });
});

// -------------------- Verify login OTP --------------------
router.post('/verify-login-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ message: 'OTP verified. Login successful', token });
});

// -------------------- Forgot Password - Send OTP --------------------
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email not registered' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, code });
  await sendOtp(email, code);

  res.json({ message: 'OTP sent to email' });
});

// -------------------- Forgot Password - Verify OTP & Reset --------------------
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = await Otp.findOne({ email, code: otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { password: hashed });
  await Otp.deleteMany({ email });

  res.json({ message: 'Password reset successful' });
});

// -------------------- Google OAuth --------------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const email = req.user.email;

    // Dynamic redirect to frontend
    res.redirect(`${CLIENT_URL}/oauth-success?token=${token}&email=${encodeURIComponent(email)}`);
  }
);

// -------------------- Get Logged-in User Profile --------------------
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
