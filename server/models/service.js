const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  note: { type: String },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed'],
    default: 'upcoming',
  },
});

module.exports = mongoose.model('Service', serviceSchema);
