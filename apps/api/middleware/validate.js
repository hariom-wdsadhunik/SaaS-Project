const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof ZodError || error.name === 'ZodError' || error.issues) {
      const issues = Array.isArray(error.issues) ? error.issues : (Array.isArray(error.errors) ? error.errors : []);
      const details = issues.map((err) => ({
        field: Array.isArray(err.path) && err.path.length > 0 ? err.path.join('.') : 'body',
        message: err.message
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details
      });
    }
    next(error);
  }
};

module.exports = validate;
