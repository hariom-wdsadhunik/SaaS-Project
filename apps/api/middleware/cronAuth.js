const crypto = require('crypto');
const { config } = require('../config');

const cronAuth = (req, res, next) => {
  const cronSecret = config.cron.secret;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !cronSecret) {
    return res.status(500).json({ error: 'Server misconfiguration: CRON_SECRET is required in production' });
  }

  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-cron-secret'];
  let providedSecret = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    providedSecret = authHeader.substring(7).trim();
  } else if (customHeader) {
    providedSecret = customHeader.trim();
  }

  if (!providedSecret || !cronSecret) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid CRON_SECRET' });
  }

  try {
    const expectedBuffer = Buffer.from(cronSecret);
    const providedBuffer = Buffer.from(providedSecret);

    if (expectedBuffer.length !== providedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, providedBuffer)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET format' });
  }

  next();
};

module.exports = { cronAuth };
