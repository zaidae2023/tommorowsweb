// Import the JSON Web Token library and the User model
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware function to protect routes by verifying JWT tokens
module.exports = async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // 1. Try to get the token from the "Authorization" header (e.g., "Bearer <token>")
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]; // Extract the token part
    }

    // 2. If token not found in header, check cookies (if token is stored in cookies)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. If token is still not found, deny access
    if (!token) {
      console.warn('❌ No token provided');
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // 4. Log the received token for debugging (optional)
    console.log('🔐 Received token:', token);

    // 5. Verify the token using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Find the user from the decoded token and exclude the password field
    const user = await User.findById(decoded.id).select('-password');
    
    // If user doesn't exist, deny access
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // 7. Attach user data to request object so other routes can access it
    req.user = user;
    req.userId = user._id;

    // 8. Allow the request to continue to the next middleware or route
    next();

  } catch (err) {
    // Log the error for debugging
    console.error('❌ Auth error:', err.name, err.message);

    // Handle specific JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or malformed token. Please login again.' });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }

    // Catch-all unauthorized response
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
