const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/user');
const Otp = require('../models/otp');
const sendOtp = require('../utils/sendOtp');

const router = express.Router();

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

// -------------------- Login (JWT returned in response) --------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // ✅ Return token in response body
  res.json({ message: 'Login successful', token });
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

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: false,
}), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.redirect(`http://localhost:5173/dashboard?token=${token}`);
});

// -------------------- Get Logged-in User Profile --------------------
const authenticate = require('../middleware/authMiddleware');
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
