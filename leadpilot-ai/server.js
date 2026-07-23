const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const logger = require("./logger");
const { config, validateConfig } = require("./config");
const demoStore = require('./db/demoStore');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Production-ready CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin header (curl, Postman, server-to-server, same-origin)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.cors.allowedOrigins;
    const isProd = config.env === 'production';

    // Development or explicit wildcard mode
    if (allowedOrigins.includes('*') || (!isProd && !process.env.CORS_ORIGIN)) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    return callback(new Error(`CORS Policy: Origin '${origin}' is not allowed.`));
  },
  credentials: config.cors.credentials,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders
};

app.use(cors(corsOptions));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } });
app.use('/api/', limiter);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Structured HTTP Request Logging
const morganStream = {
  write: (message) => logger.info({ type: 'http' }, message.trim())
};
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));

// Static UI serving
app.use(express.static(path.join(__dirname, "public")));
app.use('/leadpilot-ui', express.static(path.join(__dirname, "leadpilot-ui")));

// ============================================
// MODULAR ROUTERS
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/email', require('./routes/email'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/team', require('./routes/team'));
app.use('/api/import', require('./routes/import'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/sequences', require('./routes/sequences'));
app.use('/webhook', require('./routes/webhook'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'demo' });
});

// UI Page routes
const pages = {
  '/': 'landing.html', '/landing': 'landing.html',
  '/login': 'login.html', '/login.html': 'login.html',
  '/register': 'register.html', '/register.html': 'register.html',
  '/dashboard': 'dashboard-pro.html',
  '/analytics': 'analytics.html', '/analytics.html': 'analytics.html',
  '/settings': 'settings.html', '/settings.html': 'settings.html',
  '/calendar': 'calendar.html',
  '/tasks': 'tasks.html',
  '/deals': 'deals.html',
  '/team': 'team.html',
  '/documents': 'documents.html',
  '/email-templates': 'email-templates.html',
  '/onboarding': 'onboarding.html'
};

Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (req, res) => res.sendFile(path.join(__dirname, 'leadpilot-ui', file)));
});

// 404 Handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error({ err, path: req.path, method: req.method }, 'Global Error: ' + err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Export app for serverless deployments (Vercel) & testing
module.exports = app;

// Start server if executed directly
if (require.main === module) {
  validateConfig();
  const PORT = process.env.PORT || config.port || 3000;
  demoStore.seedData().then(() => {
    app.listen(PORT, () => {
      logger.info({ port: PORT, mode: config.env }, `🚀 LeadPilot AI CRM running on http://localhost:${PORT}`);
      logger.info('📊 Mode: DEMO (in-memory, no database needed)');
      logger.info('👤 Demo login: admin@leadpilot.ai / admin123');
    });
  });
}
