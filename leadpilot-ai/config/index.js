require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
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
    max: 100,
  },
};

const validateConfig = () => {
  const critical = [];
  const warnings = [];

  if (!config.jwt.secret) {
    critical.push('jwt.secret');
  } else if (config.jwt.secret.includes('fallback_')) {
    critical.push('jwt.secret (using insecure fallback)');
  }

  if (!config.supabase.url) critical.push('supabase.url');
  if (!config.supabase.serviceKey) critical.push('supabase.serviceKey');

  const optional = [];
  if (!config.supabase.anonKey) optional.push('supabase.anonKey');
  if (!config.email.apiKey) optional.push('email.apiKey (emails will not be sent)');
  if (!config.redis.url) optional.push('redis.url (caching disabled)');

  if (critical.length > 0) {
    const errorMsg = `Critical configuration missing:\n  - ${critical.join('\n  - ')}`;
    if (isProduction) {
      throw new Error(errorMsg);
    } else {
      console.error('❌', errorMsg);
      console.warn('⚠️  Application may not function correctly in production.');
    }
  }

  if (optional.length > 0) {
    console.warn('⚠️  Optional configuration missing:', optional.join(', '));
  }

  if (critical.length === 0) {
    console.log('✅ All critical configuration validated');
  }

  return critical.length === 0;
};

module.exports = { config, validateConfig };
