// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT token from cookies or Authorization header
module.exports = async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // 1. Try to get token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fallback to cookie (optional)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. If token is still not found, return
    if (!token) {
      console.warn('❌ No token provided');
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // 4. Debug log
    console.log('🔐 Received token:', token);

    // 5. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();

  } catch (err) {
    console.error('❌ Auth error:', err.name, err.message);

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or malformed token. Please login again.' });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
};
