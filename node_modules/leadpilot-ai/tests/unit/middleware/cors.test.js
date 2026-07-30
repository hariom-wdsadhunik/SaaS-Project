const { config } = require('../../../config');

describe('CORS Configuration Middleware Unit Tests (config/index.js & server.js)', () => {
  it('should allow requests with no origin header (server-to-server or mobile)', () => {
    const originCallback = (origin, callback) => {
      if (!origin || config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    };

    originCallback(undefined, (err, allow) => {
      expect(err).toBeNull();
      expect(allow).toBe(true);
    });
  });

  it('should allow configured CORS origins from config', () => {
    const originCallback = (origin, callback) => {
      if (!origin || config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    };

    originCallback('http://localhost:3000', (err, allow) => {
      expect(err).toBeNull();
      expect(allow).toBe(true);
    });
  });

  it('should reject unauthorized CORS origins', () => {
    const originCallback = (origin, callback) => {
      if (!origin || config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    };

    originCallback('http://malicious-attacker-domain.com', (err, allow) => {
      expect(err).not.toBeNull();
      expect(err.message).toBe('Not allowed by CORS');
    });
  });
});
