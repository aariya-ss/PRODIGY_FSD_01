const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get } = require('../config/db');
const { registerSchema, loginSchema } = require('../utils/validation');

// Helper to sign JWT token
const signToken = (userId, rememberMe) => {
  const expiresIn = rememberMe ? '7d' : '1h';
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

// Helper to get cookie options
const getCookieOptions = (rememberMe) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  
  if (rememberMe) {
    // 7 days
    options.maxAge = 7 * 24 * 60 * 60 * 1000;
  }
  
  return options;
};

// Register User
const register = async (req, res, next) => {
  try {
    // Validate request
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    // Check if email already exists
    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const result = await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    );

    // Fetch newly created user details (excluding password)
    const newUser = await get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [result.id]);

    // Sign token and set cookie (defaults to standard 1 hour session on registration)
    const token = signToken(newUser.id, false);
    res.cookie('token', token, getCookieOptions(false));

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    // Validate request
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const rememberMe = !!req.body.rememberMe;

    // Retrieve user by email
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Sign token and set cookie
    const token = signToken(user.id, rememberMe);
    res.cookie('token', token, getCookieOptions(rememberMe));

    // Construct public user object
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: publicUser
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

// Get Current User Profile
const me = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  logout,
  me
};
