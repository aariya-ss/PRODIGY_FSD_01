const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/db');

// Helper to generate access and refresh tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

// Cookie configuration options
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge
});

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Basic Input Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields (username, email, password) are required' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }

    // Verify email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check for unique username
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Check for unique email
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password with 12 bcrypt rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If first user, make them admin. Otherwise respect role if provided and valid.
    const allUsers = await User.findAll();
    let assignedRole = 'user';
    if (allUsers.length === 0) {
      assignedRole = 'admin';
    } else if (role && ['user', 'admin'].includes(role)) {
      assignedRole = role;
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    // Query user by username or email
    let user = await User.findByUsername(usernameOrEmail);
    if (!user) {
      user = await User.findByEmail(usernameOrEmail);
    }

    // Generic credentials check to prevent username enumeration
    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    // Token creation
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save active refresh token in DB
    await User.update(user.id, { refreshToken });

    // Set secure HTTP-only cookies
    res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15 mins
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies ? req.cookies.refreshToken : null;

    if (!token) {
      return res.status(401).json({ error: 'Refresh token required', code: 'NO_REFRESH_TOKEN' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Refresh token revoked or invalid', code: 'REVOKED_REFRESH_TOKEN' });
    }

    // Perform Refresh Token Rotation
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await User.update(user.id, { refreshToken: newRefreshToken });

    res.cookie('accessToken', newAccessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    res.json({ message: 'Tokens refreshed successfully' });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies ? req.cookies.refreshToken : null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.update(decoded.id, { refreshToken: null });
      } catch (err) {
        // If token is invalid or expired, search and remove matches anyway
        const users = await User.findAll();
        const matchedUser = users.find(u => u.refreshToken === token);
        if (matchedUser) {
          await User.update(matchedUser.id, { refreshToken: null });
        }
      }
    }

    // Clear cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Server error during logout' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ error: 'Server error loading profile' });
  }
};

module.exports = { register, login, refresh, logout, getMe };
