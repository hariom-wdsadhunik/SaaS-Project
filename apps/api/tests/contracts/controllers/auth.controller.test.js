const authController = require('../../../controllers/authController');
const repository = require('../../../db');
const bcrypt = require('bcryptjs');
const { createMockContext } = require('./controller.setup');

describe('Auth Controller Contract Tests (controllers/authController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('POST /api/auth/register', () => {
    it('should return 201 Created with token and user object on valid registration', async () => {
      req.body = { email: 'new@leadpilot.ai', password: 'password123', name: 'New User' };
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'createUser').mockResolvedValue({
        id: 'user-99',
        email: 'new@leadpilot.ai',
        name: 'New User',
        role: 'agent'
      });

      await authController.register(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: 'User registered successfully',
        token: expect.any(String),
        user: { id: 'user-99', email: 'new@leadpilot.ai', name: 'New User', role: 'agent' }
      });
    });

    it('should return 400 Bad Request when required fields are missing', async () => {
      req.body = { email: 'new@leadpilot.ai' };

      await authController.register(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Email, password, and name are required' });
    });

    it('should return 400 Bad Request when password length is less than 6', async () => {
      req.body = { email: 'new@leadpilot.ai', password: '123', name: 'Short Pass' };

      await authController.register(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Password must be at least 6 characters' });
    });

    it('should return 409 Conflict when email is already registered', async () => {
      req.body = { email: 'existing@leadpilot.ai', password: 'password123', name: 'Existing' };
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({ id: 'user-1', email: 'existing@leadpilot.ai' });

      await authController.register(req, res);

      expect(res.statusCode).toBe(409);
      expect(res.body).toEqual({ error: 'User already exists with this email' });
    });

    it('should return 500 Internal Server Error when repository throws', async () => {
      req.body = { email: 'err@leadpilot.ai', password: 'password123', name: 'Err User' };
      jest.spyOn(repository, 'getUserByEmail').mockRejectedValue(new Error('Database error'));

      await authController.register(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Registration failed' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 OK with token and user profile on valid credentials', async () => {
      req.body = { email: 'admin@leadpilot.ai', password: 'password123' };
      const hashedPassword = await bcrypt.hash('password123', 10);
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({
        id: 'user-1',
        email: 'admin@leadpilot.ai',
        name: 'Admin User',
        role: 'admin',
        team_id: 'team-1',
        password: hashedPassword
      });

      await authController.login(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: 'Login successful',
        token: expect.any(String),
        user: { id: 'user-1', email: 'admin@leadpilot.ai', name: 'Admin User', role: 'admin', team_id: 'team-1' }
      });
    });

    it('should return 400 Bad Request when email or password is missing', async () => {
      req.body = { email: 'admin@leadpilot.ai' };

      await authController.login(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 401 Unauthorized when user email is not found', async () => {
      req.body = { email: 'unknown@leadpilot.ai', password: 'password123' };
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return 401 Unauthorized when password does not match', async () => {
      req.body = { email: 'admin@leadpilot.ai', password: 'wrongpassword' };
      const hashedPassword = await bcrypt.hash('password123', 10);
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({
        id: 'user-1',
        password: hashedPassword
      });

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return 500 Internal Server Error when repository error occurs', async () => {
      req.body = { email: 'admin@leadpilot.ai', password: 'password123' };
      jest.spyOn(repository, 'getUserByEmail').mockRejectedValue(new Error('DB Conn Error'));

      await authController.login(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Login failed' });
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 200 OK with authenticated user profile', async () => {
      req.user = { id: 'user-1' };
      jest.spyOn(repository, 'getUserById').mockResolvedValue({
        id: 'user-1',
        email: 'admin@leadpilot.ai',
        name: 'Admin User',
        role: 'admin',
        team_id: 'team-1'
      });

      await authController.getCurrentUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        user: { id: 'user-1', email: 'admin@leadpilot.ai', name: 'Admin User', role: 'admin', team_id: 'team-1' }
      });
    });

    it('should return 404 Not Found if user is missing in DB', async () => {
      req.user = { id: 'user-999' };
      jest.spyOn(repository, 'getUserById').mockResolvedValue(null);

      await authController.getCurrentUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });

    it('should return 500 Internal Server Error on repository failure', async () => {
      req.user = { id: 'user-1' };
      jest.spyOn(repository, 'getUserById').mockRejectedValue(new Error('DB err'));

      await authController.getCurrentUser(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to get user' });
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should return 200 OK with updated profile information', async () => {
      req.user = { id: 'user-1' };
      req.body = { name: 'Updated Name', phone: '9998887770' };
      jest.spyOn(repository, 'getUserById').mockResolvedValue({ id: 'user-1' });
      jest.spyOn(repository, 'updateUser').mockResolvedValue({ id: 'user-1', email: 'admin@leadpilot.ai', name: 'Updated Name' });

      await authController.updateProfile(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: 'Profile updated',
        user: { id: 'user-1', email: 'admin@leadpilot.ai', name: 'Updated Name' }
      });
    });

    it('should return 404 Not Found if user does not exist', async () => {
      req.user = { id: 'user-99' };
      jest.spyOn(repository, 'getUserById').mockResolvedValue(null);

      await authController.updateProfile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });
  });

  describe('PUT /api/auth/password', () => {
    it('should return 200 OK on successful password change', async () => {
      req.user = { id: 'user-1', email: 'admin@leadpilot.ai' };
      req.body = { currentPassword: 'oldpassword', newPassword: 'newpassword123' };
      const oldHash = await bcrypt.hash('oldpassword', 10);
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({ id: 'user-1', password: oldHash });
      jest.spyOn(repository, 'updateUser').mockResolvedValue({ id: 'user-1' });

      await authController.changePassword(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Password changed successfully' });
    });

    it('should return 400 Bad Request when passwords are missing', async () => {
      req.body = { currentPassword: 'oldpassword' };

      await authController.changePassword(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Both passwords required' });
    });

    it('should return 401 Unauthorized when current password is incorrect', async () => {
      req.user = { id: 'user-1', email: 'admin@leadpilot.ai' };
      req.body = { currentPassword: 'wrongpassword', newPassword: 'newpassword123' };
      const oldHash = await bcrypt.hash('oldpassword', 10);
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({ id: 'user-1', password: oldHash });

      await authController.changePassword(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Current password is incorrect' });
    });
  });
});
