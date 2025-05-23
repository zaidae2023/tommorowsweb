const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Vehicle = require('../models/vehicle');

router.use(authMiddleware);

// ✅ GET /api/vehicles - Get all vehicles for the logged-in user
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });
    res.status(200).json({ vehicles });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ message: 'Failed to fetch vehicles', error: err.message });
  }
});

// ✅ POST /api/vehicles - Add new vehicle
router.post('/', async (req, res) => {
  try {
    const { name, model, year, registration } = req.body;

    const newVehicle = new Vehicle({
      userId: req.user._id,
      name,
      model,
      year,
      registration,
    });

    await newVehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).json({ message: 'Failed to add vehicle', error: err.message });
  }
});

module.exports = router;
