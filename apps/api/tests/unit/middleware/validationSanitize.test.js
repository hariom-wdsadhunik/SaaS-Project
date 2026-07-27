const { validate, sanitize, schemas } = require('../../../middleware/validation');

describe('Joi Validation & XSS Sanitization Middleware Unit Tests (middleware/validation.js)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should sanitize XSS script tags and javascript: URIs from body, query, and params', () => {
    req.body = {
      name: 'John <script>alert("xss")</script> Doe',
      website: 'javascript:alert(1)'
    };
    req.query = {
      search: 'Test <script>eval("xss")</script>'
    };

    sanitize(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.name).toBe('John  Doe');
    expect(req.body.website).toBe('alert(1)');
    expect(req.query.search).toBe('Test');
  });

  it('should recursively sanitize nested objects, arrays, and numbers', () => {
    req.body = {
      title: 'Valid',
      count: 42,
      tags: ['<script>xss</script>', 'clean'],
      meta: {
        bio: 'Hello <script>alert("xss")</script> World'
      }
    };

    sanitize(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.tags).toEqual(['', 'clean']);
    expect(req.body.meta.bio).toBe('Hello  World');
  });

  it('should validate Joi schema and allow valid input', () => {
    req.body = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const middleware = validate(schemas.register);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 when Joi schema validation fails', () => {
    req.body = {
      email: 'invalid-email',
      password: '123'
    };

    const middleware = validate(schemas.register);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array)
      })
    );
  });
});
