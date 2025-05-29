const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Vehicle = require('../models/vehicle');
const User = require('../models/user'); // ✅ Import User model

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

// ✅ POST /api/vehicles - Add new vehicle (limit 1 for free users)
router.post('/', async (req, res) => {
  try {
    const { vin, name, model, year, registration } = req.body;

    const user = await User.findById(req.user._id);
    const vehicleCount = await Vehicle.countDocuments({ userId: req.user._id });

    if (user.plan === 'free' && vehicleCount >= 1) {
      return res.status(403).json({
        message: 'Free user limit reached. Upgrade to Premium to register more vehicles.'
      });
    }

    const newVehicle = new Vehicle({
      userId: req.user._id,
      vin: vin?.trim(),
      name,
      model,
      year,
      registration,
    });

    await newVehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (err) {
    console.error('Error adding vehicle:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate ${field} found. It must be unique.` });
    }
    res.status(500).json({ message: 'Failed to add vehicle', error: err.message });
  }
});

// ✅ DELETE /api/vehicles/:id - Delete a vehicle by ID
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ message: 'Failed to delete vehicle', error: err.message });
  }
});

module.exports = router;
