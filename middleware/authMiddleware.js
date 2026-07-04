const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Attempt to read from HTTP-only cookie first, then fall back to Authorization header
  let token = req.cookies ? req.cookies.accessToken : null;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required', code: 'NO_TOKEN' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid or tampered access token', code: 'INVALID_TOKEN' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied: insufficient privileges', code: 'FORBIDDEN' });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
