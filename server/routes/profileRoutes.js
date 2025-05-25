const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 🗂️ Set up multer storage
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

// ✅ GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar ? `/uploads/avatars/${path.basename(user.avatar)}` : '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// ✅ PUT /api/profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true });
    res.json({ name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// ✅ POST /api/profile/avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Delete previous avatar file
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

// ✅ DELETE /api/profile/avatar
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
