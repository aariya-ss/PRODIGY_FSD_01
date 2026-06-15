const express = require('express');
const router = express.Router();
const { register, login, logout, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public authentication routes (with rate limiting for login/registration)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Logout route
router.post('/logout', logout);

// Profile check (requires active session/JWT)
router.get('/me', authenticate, me);

module.exports = router;
