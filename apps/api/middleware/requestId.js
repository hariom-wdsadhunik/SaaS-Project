const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to assign a unique X-Request-ID to every HTTP request.
 * Attaches request ID to request object, response headers, and logger context.
 */
module.exports = function requestIdMiddleware(req, res, next) {
  const reqId = req.headers['x-request-id'] || uuidv4();
  req.id = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
};
