const express = require('express');
const Service = require('../models/service');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protect all routes
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
      status: 'upcoming' // Default status on creation
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

// ✅ Get upcoming services only
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();

    const upcomingServices = await Service.find({
      userId: req.userId,
      status: 'upcoming',
      date: { $gte: today }
    })
      .populate('vehicleId', 'name model year')
      .sort({ date: 1 });

    res.json(upcomingServices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch upcoming services', error: err.message });
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

// ✅ Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Service.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Service not found or not authorized' });
    }

    res.status(200).json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }
});

module.exports = router;
