const jwt = require('jsonwebtoken');
const { config } = require('../config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      team_id: user.team_id 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn || '7d' }
  );
};

module.exports = { authenticateToken, generateToken, get JWT_SECRET() { return config.jwt.secret; } };
