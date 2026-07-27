const { authLimiter, registerLimiter } = require('../../../middleware/rateLimiter');

describe('Rate Limiter Middleware Unit Tests (middleware/rateLimiter.js)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { ip: '127.0.0.1', headers: {}, app: { get: () => false } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      getHeader: jest.fn()
    };
    next = jest.fn();
  });

  it('should allow requests under rate limit threshold', async () => {
    await authLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should export valid authLimiter and registerLimiter express middleware functions', () => {
    expect(typeof authLimiter).toBe('function');
    expect(typeof registerLimiter).toBe('function');
  });
});
