// models/expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  type: {
    type: String,
    enum: ['Fuel', 'Repair', 'Insurance', 'Other'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD', // ✅ Default currency
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
