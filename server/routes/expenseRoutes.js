const express = require('express');
const Expense = require('../models/expense');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Create new expense and populate vehicle info
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vehicleId, type, amount, note, currency } = req.body; // ✅ include currency

    let newExpense = await Expense.create({
      userId: req.userId,
      vehicleId,
      type,
      amount,
      note,
      currency: currency || 'USD', // ✅ fallback to USD if not provided
    });

    // ✅ Populate vehicle details for frontend display
    newExpense = await newExpense.populate('vehicleId', 'name model year');

    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create expense', error: err.message });
  }
});

// ✅ Get all expenses with vehicle details
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .populate('vehicleId', 'name model year');

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});

// ✅ Delete an expense by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
});

module.exports = router;
