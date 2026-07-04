require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const { authenticateToken, requireRole } = require('./middleware/authMiddleware');

// Validate critical environment variables
if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error('CRITICAL ERROR: JWT secrets must be set in the environment (.env file).');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Basic Security Headers (Helmet-like custom implementation)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "script-src 'self' 'unsafe-inline'; " +
    "connect-src 'self';"
  );
  next();
});

// 2. Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Rate Limiter for Authentication endpoints (Registration and Login)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

// 4. API Endpoints
// Authentication Router
app.post('/api/auth/register', authLimiter, authController.register);
app.post('/api/auth/login', authLimiter, authController.login);
app.post('/api/auth/refresh', authController.refresh);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/me', authenticateToken, authController.getMe);

// Admin Control Router (Protected by Authentication & Admin Role)
app.get('/api/admin/users', authenticateToken, requireRole('admin'), adminController.getAllUsers);
app.put('/api/admin/users/:id/role', authenticateToken, requireRole('admin'), adminController.updateUserRole);
app.delete('/api/admin/users/:id', authenticateToken, requireRole('admin'), adminController.deleteUser);

// 5. Clean Route Handlers for Static Pages (Served from /public)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/unauthorized', (req, res) => res.sendFile(path.join(__dirname, 'public', 'unauthorized.html')));

// 6. Serve general assets (CSS, JS) from /public
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint or resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  JWT Auth System Server running on port ${PORT} `);
  console.log(`  Local URL: http://localhost:${PORT}          `);
  console.log(`===============================================`);
});
