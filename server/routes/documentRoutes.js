const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Document = require('../models/Document');
const User = require('../models/user');

const router = express.Router();

// Multer setup to store files in /uploads/documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

// Middleware to extract user from token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Upload Document (limit 3 for free users)
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userDocs = await Document.countDocuments({ userId: user._id });

    if (user.plan === 'free' && userDocs >= 3) {
      return res.status(403).json({ message: 'Document upload limit reached for free users. Upgrade to premium to upload more.' });
    }

    const { docType, expiryDate } = req.body;
    const fileUrl = `/uploads/documents/${req.file.filename}`;

    const newDoc = new Document({
      userId: user._id,
      docType,
      fileUrl,
      expiryDate,
    });

    await newDoc.save();

    // Return updated document list
    const updatedDocs = await Document.find({ userId: user._id }).sort({ expiryDate: 1 });
    res.status(201).json(updatedDocs);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// ✅ Get Documents
router.get('/', authenticate, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({ expiryDate: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

// ✅ Delete Document
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (doc.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this document' });
    }

    // Delete file from disk if exists
    const filePath = path.join(__dirname, '..', doc.fileUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Failed to delete file from disk:', err.message);
    });

    await doc.deleteOne();

    // Return updated document list
    const updatedDocs = await Document.find({ userId: req.user.id }).sort({ expiryDate: 1 });
    res.json(updatedDocs);
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

module.exports = router;
