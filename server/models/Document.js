// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  docType: {
    type: String,
    required: true,
    enum: ['Insurance', 'Registration', 'Pollution Certificate'],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
