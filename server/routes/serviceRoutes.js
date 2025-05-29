const express = require('express');
const Service = require('../models/service');
const User = require('../models/user'); // ✅ Import User model
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// ✅ Add a new service (limit to 2 for free users)
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const serviceCount = await Service.countDocuments({ userId: req.userId });

    if (user.plan === 'free' && serviceCount >= 2) {
      return res.status(403).json({
        message: 'Free user limit reached. Upgrade to Premium to schedule more services.'
      });
    }

    const { vehicleId, type, date, note } = req.body;
    const service = await Service.create({
      userId: req.userId,
      vehicleId,
      type,
      date,
      note,
      status: 'upcoming'
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

// ✅ Predictive Maintenance Route
router.get('/predictive', async (req, res) => {
  try {
    const services = await Service.find({ userId: req.userId, status: 'completed' })
      .populate('vehicleId', 'name model year')
      .sort({ date: 1 });

    const predictions = {};
    services.forEach((service) => {
      const key = `${service.vehicleId._id}_${service.type}`;
      if (!predictions[key]) predictions[key] = [];
      predictions[key].push(service);
    });

    const results = [];

    for (const key in predictions) {
      const logs = predictions[key];
      if (logs.length < 2) continue;

      const last = logs[logs.length - 1];
      const secondLast = logs[logs.length - 2];

      const lastDate = new Date(last.date);
      const prevDate = new Date(secondLast.date);
      const avgIntervalDays = (lastDate - prevDate) / (1000 * 60 * 60 * 24);

      const predictedNext = new Date(lastDate.getTime() + avgIntervalDays * 24 * 60 * 60 * 1000);

      results.push({
        vehicle: last.vehicleId,
        component: last.type,
        lastServiced: lastDate.toDateString(),
        expectedNext: predictedNext.toDateString(),
        status:
          predictedNext < new Date()
            ? 'Overdue'
            : (predictedNext - new Date()) / (1000 * 60 * 60 * 24) <= 15
              ? 'Due Soon'
              : 'Good'
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate predictions', error: err.message });
  }
});

// ✅ Update service status
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
