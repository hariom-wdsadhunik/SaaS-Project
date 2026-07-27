const rateLimit = require('express-rate-limit');

// Dedicated Rate Limiter for Login (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.'
  },
  statusCode: 429
});

// Dedicated Rate Limiter for Registration (Spam registration protection)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many accounts created from this IP. Please try again after an hour.'
  },
  statusCode: 429
});

module.exports = { authLimiter, registerLimiter };
