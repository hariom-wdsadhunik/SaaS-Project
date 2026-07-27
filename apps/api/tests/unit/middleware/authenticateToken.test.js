const jwt = require('jsonwebtoken');
const { authenticateToken, generateToken } = require('../../../middleware/auth');
const { config } = require('../../../config');

describe('JWT Authentication Middleware Unit Tests (middleware/auth.js)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should authenticate valid JWT token and attach req.user', () => {
    const token = generateToken({ id: 'u-1', email: 'test@example.com', role: 'admin', team_id: 't-1' });
    req.headers['authorization'] = `Bearer ${token}`;

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('u-1');
    expect(req.user.email).toBe('test@example.com');
  });

  it('should return 401 if Authorization header is missing', () => {
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is missing Bearer prefix or empty', () => {
    req.headers['authorization'] = '';

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
  });

  it('should return 403 for expired JWT token', () => {
    const expiredToken = jwt.sign(
      { id: 'u-1', email: 'test@example.com' },
      config.jwt.secret,
      { expiresIn: '-1s' }
    );
    req.headers['authorization'] = `Bearer ${expiredToken}`;

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 for JWT signed with invalid secret', () => {
    const wrongToken = jwt.sign(
      { id: 'u-1', email: 'test@example.com' },
      'wrong-secret-key-12345'
    );
    req.headers['authorization'] = `Bearer ${wrongToken}`;

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  it('should return 403 for malformed token string', () => {
    req.headers['authorization'] = 'Bearer invalid.jwt.structure';

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });
});
