// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT token from cookies or Authorization header
module.exports = async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // 1. Check token in Authorization header (Bearer token)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fallback to token in cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. If no token found, block access
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // 4. Verify token and decode user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Find user in DB and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user' });
    }

    req.user = user;       // Full user data (excluding password)
    req.userId = user._id; // For convenience
    next();

  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
