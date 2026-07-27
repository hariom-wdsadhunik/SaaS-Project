const { cronAuth } = require('../../../middleware/cronAuth');
const { config } = require('../../../config');

describe('Cron Authentication Middleware Unit Tests (middleware/cronAuth.js)', () => {
  let req, res, next;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    config.cron.secret = 'test-cron-secret-12345';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should authenticate valid CRON_SECRET via Authorization: Bearer header', () => {
    req.headers['authorization'] = 'Bearer test-cron-secret-12345';

    cronAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should authenticate valid CRON_SECRET via x-cron-secret header', () => {
    req.headers['x-cron-secret'] = 'test-cron-secret-12345';

    cronAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should reject requests with missing secret header (401)', () => {
    cronAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Missing or invalid CRON_SECRET' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject requests with invalid CRON_SECRET (401)', () => {
    req.headers['x-cron-secret'] = 'wrong-cron-secret';

    cronAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid CRON_SECRET' });
  });

  it('should return 500 server error in production when CRON_SECRET is missing from server config', () => {
    process.env.NODE_ENV = 'production';
    config.cron.secret = '';

    cronAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server misconfiguration: CRON_SECRET is required in production' });
  });
});
