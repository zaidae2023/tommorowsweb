const express = require('express');
const Expense = require('../models/expense');
const User = require('../models/user'); // ✅ Import User model
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Create new expense and limit to 3 for free users
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vehicleId, type, amount, note, currency } = req.body;

    // ✅ Get the user and check plan
    const user = await User.findById(req.userId);
    const expenseCount = await Expense.countDocuments({ userId: req.userId });

    if (user.plan === 'free' && expenseCount >= 3) {
      return res.status(403).json({ message: 'Free user limit reached. Upgrade to Premium to add more expenses.' });
    }

    let newExpense = await Expense.create({
      userId: req.userId,
      vehicleId,
      type,
      amount,
      note,
      currency: currency || 'USD',
    });

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
