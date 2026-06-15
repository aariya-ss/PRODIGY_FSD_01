const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected admin routes (requires login and 'admin' role)
router.get('/dashboard', authenticate, authorize(['admin']), getDashboard);

module.exports = router;
