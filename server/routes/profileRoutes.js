const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 🗂️ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}_avatar${ext}`);
  },
});
const upload = multer({ storage });

// ✅ GET /api/profile - Fetch profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar ? `/uploads/avatars/${path.basename(user.avatar)}` : '',
      twoFactorEnabled: user.twoFactorEnabled || false,
      plan: user.plan || 'free', // ✅ return current plan
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// ✅ PUT /api/profile - Update fullName
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { fullName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName },
      { new: true }
    );
    res.json({ fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// ✅ PUT /api/profile/twofactor - Toggle 2FA (premium users only)
router.put('/twofactor', authMiddleware, async (req, res) => {
  try {
    const { enabled } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 🔒 Only premium users can enable 2FA
    if (user.plan === 'free') {
      return res.status(403).json({
        message: '2FA is only available for premium users. Please upgrade your plan.',
      });
    }

    user.twoFactorEnabled = !!enabled;
    await user.save();

    res.json({ message: `2FA ${enabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update 2FA setting', error: err.message });
  }
});

// ✅ POST /api/profile/avatar - Upload avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Delete old avatar if it exists
    if (user.avatar && fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    user.avatar = req.file.path;
    await user.save();

    res.json({
      message: 'Avatar uploaded',
      avatar: `/uploads/avatars/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload avatar', error: err.message });
  }
});

// ✅ DELETE /api/profile/avatar - Remove avatar
router.delete('/avatar', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.avatar && fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    user.avatar = '';
    await user.save();

    res.json({ message: 'Avatar deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete avatar', error: err.message });
  }
});

module.exports = router;
