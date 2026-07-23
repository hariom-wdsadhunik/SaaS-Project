const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

// Dedicated rate limited & schema validated auth routes
router.post('/register', registerLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected user routes (guarded by JWT and global rate limiter)
router.get('/me', authenticateToken, authController.getCurrentUser);
router.patch('/profile', authenticateToken, authController.updateProfile);
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
