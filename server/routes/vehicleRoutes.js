const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Use middleware on all routes below
router.use(authMiddleware);

// Example protected GET route
router.get('/', async (req, res) => {
  res.json({ message: `Hello, ${req.user.fullName}. You accessed a protected route.` });
});

module.exports = router;
