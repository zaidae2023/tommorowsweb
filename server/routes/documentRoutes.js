// routes/documentRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Document = require('../models/Document');

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

// POST /api/documents
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { docType, expiryDate } = req.body;
    const fileUrl = `/uploads/documents/${req.file.filename}`;

    const newDoc = new Document({
      userId: req.user.id,
      docType,
      fileUrl,
      expiryDate,
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded', doc: newDoc });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// GET /api/documents
router.get('/', authenticate, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({ expiryDate: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

module.exports = router;
