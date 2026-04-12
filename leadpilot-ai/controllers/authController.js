const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'leadpilot_demo_secret';
const isDemoMode = process.env.SUPABASE_SERVICE_KEY === 'demo_mode';

const demoUsers = new Map();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, team_id: user.team_id },
    JWT_SECRET,
    { expiresIn: '7d' }
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

    if (isDemoMode) {
      if (demoUsers.has(email)) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: 'demo-' + Date.now(),
        email,
        password: hashedPassword,
        name,
        role,
        team_id: null
      };
      
      demoUsers.set(email, user);
      const token = generateToken(user);
      
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    }

    return res.status(500).json({ error: 'Database not configured. Set SUPABASE_SERVICE_KEY in .env' });

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

    if (isDemoMode) {
      const user = demoUsers.get(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = generateToken(user);
      
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, team_id: user.team_id }
      });
    }

    return res.status(500).json({ error: 'Database not configured. Set SUPABASE_SERVICE_KEY in .env' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    res.json({ 
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        team_id: req.user.team_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

exports.updateProfile = async (req, res) => {
  res.status(501).json({ error: 'Profile update requires database' });
};

exports.changePassword = async (req, res) => {
  res.status(501).json({ error: 'Password change requires database' });
};

module.exports = exports;
module.exports.generateToken = generateToken;
module.exports.JWT_SECRET = JWT_SECRET;
