const jwt = require('jsonwebtoken');
const { get } = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check for cookie first (preferred secure storage)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Bearer token in headers (useful for API clients/testing)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No credentials found. Access denied.'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from SQLite to verify existence and latest role
      const user = await get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [decoded.id]);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Role authorization middleware
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to perform this action.'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
