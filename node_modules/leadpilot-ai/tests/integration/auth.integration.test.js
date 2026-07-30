const { app, request, setupTestData } = require('./integration.setup');

describe('Auth API Integration Tests (routes/auth.js)', () => {
  beforeEach(async () => {
    await setupTestData();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@leadpilot.ai',
          password: 'password123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('testuser@leadpilot.ai');
    });

    it('should reject registration when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@leadpilot.ai' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration when password is under 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'short@leadpilot.ai', password: '123', name: 'Short' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration when email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@leadpilot.ai',
          password: 'password123',
          name: 'Admin Duplicate'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toEqual({ error: 'User already exists with this email' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate registered user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@leadpilot.ai',
          password: 'admin123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('admin@leadpilot.ai');
    });

    it('should reject login with wrong password (401)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@leadpilot.ai',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should reject login for non-existent email (401)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@leadpilot.ai',
          password: 'admin123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('GET /api/auth/me & Middleware enforcement', () => {
    it('should return authenticated user profile when valid Bearer token is provided', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@leadpilot.ai', password: 'admin123' });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('admin@leadpilot.ai');
    });

    it('should return 401 Unauthorized when Authorization header is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Access token required' });
    });

    it('should return 403 Forbidden when token is invalid or malformed', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token_string');

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({ error: 'Invalid or expired token' });
    });
  });
});
