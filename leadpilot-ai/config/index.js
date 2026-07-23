require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const isDemoMode = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'demo_mode';

const resolveJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (isDemoMode) return 'leadpilot_demo_secret_2024';
  if (!isProduction) return 'leadpilot_dev_secret_key';
  return null;
};

const resolveCronSecret = () => {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  if (isDemoMode || !isProduction) return 'leadpilot_demo_cron_secret_2024';
  return null;
};

const resolveAllowedOrigins = () => {
  if (process.env.CORS_ORIGIN) {
    if (process.env.CORS_ORIGIN === '*') return ['*'];
    return process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean);
  }
  return [
    'http://localhost:3000',
    'http://localhost:80',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:80',
    'http://localhost:5173'
  ];
};

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  jwt: {
    secret: resolveJwtSecret(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  cron: {
    secret: resolveCronSecret(),
    batchSize: parseInt(process.env.SEQUENCE_BATCH_SIZE, 10) || 50,
  },

  cors: {
    allowedOrigins: resolveAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-cron-secret', 'x-requested-with'],
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY || 'demo_mode',
  },
  
  whatsapp: {
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'leadpilot_webhook_verify_token',
  },
  
  email: {
    service: process.env.EMAIL_SERVICE || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@leadpilot.ai',
  },
  
  redis: {
    url: process.env.REDIS_URL,
  },
  
  storage: {
    bucket: process.env.STORAGE_BUCKET || 'leadpilot-files',
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
};

const validateConfig = () => {
  if (isProduction && !process.env.JWT_SECRET) {
    throw new Error('FATAL CONFIG ERROR: JWT_SECRET environment variable must be set in production mode.');
  }

  if (isProduction && !config.cron.secret) {
    throw new Error('FATAL CONFIG ERROR: CRON_SECRET environment variable must be set in production mode.');
  }

  if (isProduction && !isDemoMode) {
    if (!process.env.SUPABASE_URL) {
      throw new Error('FATAL CONFIG ERROR: SUPABASE_URL environment variable is required in production mode.');
    }
    if (!process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('FATAL CONFIG ERROR: SUPABASE_SERVICE_KEY environment variable is required in production mode.');
    }
  }

  const optional = [];
  if (!config.email.apiKey) optional.push('EMAIL_API_KEY (email sending disabled)');
  if (!config.whatsapp.accessToken) optional.push('WHATSAPP_ACCESS_TOKEN (WhatsApp API disabled)');
  if (!config.redis.url) optional.push('REDIS_URL (in-memory caching active)');
  if (isProduction && !process.env.CORS_ORIGIN) optional.push('CORS_ORIGIN (using default development origins)');

  const logger = require('../logger');
  if (optional.length > 0) {
    logger.info({ optionalIntegrations: optional }, `Optional integrations status: ${optional.join(' | ')}`);
  } else {
    logger.info('✅ All configurations and optional integrations validated');
  }

  return true;
};

module.exports = { config, validateConfig };
