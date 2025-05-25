const express = require('express');
const Service = require('../models/service');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// Add a new service
router.post('/', async (req, res) => {
  try {
    const { vehicleId, type, date, note } = req.body;
    const service = await Service.create({
      userId: req.userId,
      vehicleId,
      type,
      date,
      note,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add service', error: err.message });
  }
});

// Get all services for the user
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ userId: req.userId })
      .populate('vehicleId', 'name model year')
      .sort({ date: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
});

// Update service status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    );
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err.message });
  }
});

module.exports = router;
