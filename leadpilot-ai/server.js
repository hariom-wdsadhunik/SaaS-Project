const { config, validateConfig } = require('./config');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

// Route imports
const webhookRoutes = require("./routes/webhook");
const leadsRoutes = require("./routes/leads");
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const analyticsRoutes = require("./routes/analytics");
const propertiesRoutes = require("./routes/properties");
const appointmentsRoutes = require("./routes/appointments");
const tasksRoutes = require("./routes/tasks");
const notesRoutes = require("./routes/notes");
const documentsRoutes = require("./routes/documents");
const dealsRoutes = require("./routes/deals");
const whatsappRoutes = require("./routes/whatsapp");
const settingsRoutes = require("./routes/settings");
const emailRoutes = require("./routes/email");
const smsRoutes = require("./routes/sms");
const sequencesRoutes = require("./routes/sequences");
const importRoutes = require("./routes/import");
const reportsRoutes = require("./routes/reports");
const goalsRoutes = require("./routes/goals");

const app = express();

// Validate configuration
validateConfig();

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

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://leadpilot.ai', 'https://www.leadpilot.ai'] 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Static files
app.use(express.static("public"));
app.use('/leadpilot-ui', express.static("leadpilot-ui"));

// API Routes
app.use("/webhook", webhookRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/sequences", sequencesRoutes);
app.use("/api/import", importRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/goals", goalsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Serve landing page as default
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/landing.html");
});

// Unified dashboard - serves the Pro dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/dashboard-pro.html");
});

// Legacy dashboard redirects
app.get("/dashboard-legacy", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/dashboard.html");
});

app.get("/dashboard-enhanced", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/dashboard-enhanced.html");
});

// Serve landing page explicitly
app.get("/landing", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/landing.html");
});

// Serve analytics page
app.get("/analytics.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/analytics.html");
});

app.get("/analytics", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/analytics.html");
});

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/login.html");
});

app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/login.html");
});

// Serve register page
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/register.html");
});

app.get("/register.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/register.html");
});

// Serve settings page
app.get("/settings", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/settings.html");
});

app.get("/settings.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/settings.html");
});

// Serve email templates page
app.get("/email-templates", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/email-templates.html");
});

// Serve calendar page
app.get("/calendar", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/calendar.html");
});

// Serve tasks page
app.get("/tasks", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/tasks.html");
});

// Serve deals page
app.get("/deals", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/deals.html");
});

// Serve team page
app.get("/team", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/team.html");
});

// Serve documents page
app.get("/documents", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/documents.html");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak error details in production
  const message = config.env === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message,
    ...(config.env !== 'production' && { stack: err.stack })
  });
});

const PORT = config.port;

// Export for Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${config.env}`);
    console.log(`🔗 API base: http://localhost:${PORT}/api`);
  });
}
