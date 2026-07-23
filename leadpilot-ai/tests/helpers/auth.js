const jwt = require('jsonwebtoken');
const { config } = require('../../config');

const getTestToken = (userPayload = {}) => {
  const payload = {
    id: userPayload.id || 'test-user-1',
    email: userPayload.email || 'admin@leadpilot.ai',
    role: userPayload.role || 'admin',
    team_id: userPayload.team_id || 'team-1'
  };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
};

const getAuthHeader = (userPayload = {}) => {
  const token = getTestToken(userPayload);
  return { Authorization: `Bearer ${token}` };
};

module.exports = { getTestToken, getAuthHeader };
