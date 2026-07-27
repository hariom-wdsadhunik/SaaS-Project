const validate = require('../../../middleware/validate');
const { createLeadSchema } = require('../../../schemas/leadSchemas');

describe('Zod Validation Middleware Unit Tests (middleware/validate.js)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should allow valid payloads and sanitize/populate req.body', () => {
    req.body = {
      name: 'Valid Lead Name',
      email: 'valid@example.com',
      phone: '9998887770',
      status: 'new'
    };

    const middleware = validate(createLeadSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.name).toBe('Valid Lead Name');
  });

  it('should return 400 with details for missing required field', () => {
    req.body = {
      email: 'valid@example.com'
    };

    const middleware = validate(createLeadSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array)
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid email format or invalid enum', () => {
    req.body = {
      name: 'Test Lead',
      email: 'not-an-email',
      status: 'invalid_status_enum'
    };

    const middleware = validate(createLeadSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const response = res.json.mock.calls[0][0];
    expect(response.error).toBe('Validation failed');
    expect(response.details.length).toBeGreaterThan(0);
  });
});
