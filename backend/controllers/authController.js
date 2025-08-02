const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const storage = require('../utils/storage');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone } = req.body;
    
    // Check if user already exists
    const existingUser = storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const userId = await storage.createUser({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    // Generate token
    const token = generateToken(userId);
    
    // Get user data (without password)
    const user = storage.findUserById(userId);
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Find user by email (with password)
    const user = storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    // Validate password
    const isValidPassword = await storage.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);
    
    // Get user without password
    const userWithoutPassword = storage.findUserById(user.id);
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = storage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { firstName, lastName, phone } = req.body;
    
    const success = storage.updateUser(req.userId, {
      first_name: firstName,
      last_name: lastName,
      phone
    });
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = storage.findUserById(req.userId);
    
    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
