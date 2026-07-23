const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const repository = require('../db');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, team_id: user.team_id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn || '7d' }
  );
}

exports.register = async (req, res) => {
  try {
    const { email, password, name, role = 'agent' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await repository.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await repository.createUser({
      email,
      password: hashedPassword,
      name,
      role,
      team_id: null
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await repository.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, team_id: user.team_id }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await repository.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, team_id: user.team_id }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await repository.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { name, email, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    const updatedUser = await repository.updateUser(req.user.id, updates);
    res.json({
      message: 'Profile updated',
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords required' });
    }

    const user = await repository.getUserByEmail(req.user.email) || await repository.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await repository.updateUser(user.id, { password: newHashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

module.exports = exports;
module.exports.generateToken = generateToken;
Object.defineProperty(module.exports, 'JWT_SECRET', { get() { return config.jwt.secret; } });
