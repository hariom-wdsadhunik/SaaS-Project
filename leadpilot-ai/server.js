const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'leadpilot_demo_secret_2024';

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

app.use(cors({ origin: '*', credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } });
app.use('/api/', limiter);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, "public")));
app.use('/leadpilot-ui', express.static(path.join(__dirname, "leadpilot-ui")));

// ============================================
// DEMO MODE - In-memory data store
// ============================================
const users = new Map();
const leads = [];
const properties = [];
const tasks = [];
const appointments = [];
const deals = [];
const notes = [];
const emailTemplates = [];
const smsLogs = [];
const settings = {};

// Seed demo data
async function seedData() {
  const hash = await bcrypt.hash('admin123', 10);
  users.set('admin@leadpilot.ai', {
    id: 'user-1', email: 'admin@leadpilot.ai', password: hash,
    name: 'Admin User', role: 'admin', team_id: 'team-1'
  });

  leads.push(
    { id: 'lead-1', phone: '919876543210', name: 'Rajesh Kumar', email: 'rajesh@email.com', message: 'Looking for 3BHK in Delhi under 1.5Cr', budget: '1.5Cr', location: 'Delhi', status: 'new', ai_score: 85, ai_priority: 'hot', created_at: new Date().toISOString() },
    { id: 'lead-2', phone: '919988776655', name: 'Priya Singh', email: 'priya@email.com', message: '2BHK in Mumbai, budget 80L', budget: '80L', location: 'Mumbai', status: 'contacted', ai_score: 72, ai_priority: 'warm', created_at: new Date(Date.now()-86400000).toISOString() },
    { id: 'lead-3', phone: '919911223344', name: 'Amit Patel', email: 'amit@email.com', message: 'Need 1BHK in Bangalore urgently', budget: null, location: 'Bangalore', status: 'new', ai_score: 45, ai_priority: 'cold', created_at: new Date(Date.now()-172800000).toISOString() },
    { id: 'lead-4', phone: '919955667788', name: 'Sneha Reddy', email: 'sneha@email.com', message: '4BHK villa in Pune, 3Cr budget', budget: '3Cr', location: 'Pune', status: 'follow-up', ai_score: 92, ai_priority: 'hot', created_at: new Date(Date.now()-259200000).toISOString() },
    { id: 'lead-5', phone: '919944556677', name: 'Vikram Sharma', email: 'vikram@email.com', message: 'Looking for investment property', budget: '2Cr', location: 'Hyderabad', status: 'closed', ai_score: 78, ai_priority: 'warm', created_at: new Date(Date.now()-345600000).toISOString() }
  );

  properties.push(
    { id: 'prop-1', title: 'Luxury 3BHK in Whitefield', property_type: '3BHK', listing_type: 'Sale', price: 15000000, city: 'Bangalore', status: 'Available', bedrooms: 3, bathrooms: 3, area_sqft: 1800, address: 'Whitefield, Bangalore', description: 'Premium 3BHK with modern amenities' },
    { id: 'prop-2', title: '2BHK Apartment in Koramangala', property_type: '2BHK', listing_type: 'Sale', price: 8500000, city: 'Bangalore', status: 'Available', bedrooms: 2, bathrooms: 2, area_sqft: 1200, address: 'Koramangala, Bangalore', description: 'Well-connected 2BHK apartment' },
    { id: 'prop-3', title: '4BHK Villa in Electronic City', property_type: '4BHK', listing_type: 'Sale', price: 25000000, city: 'Bangalore', status: 'Reserved', bedrooms: 4, bathrooms: 4, area_sqft: 3200, address: 'Electronic City, Bangalore', description: 'Luxury villa with garden' }
  );

  tasks.push(
    { id: 'task-1', title: 'Follow up with Rajesh', task_type: 'Call', priority: 'High', lead_id: 'lead-1', status: 'Pending', due_date: new Date(Date.now() + 86400000).toISOString(), description: 'Discuss 3BHK options in Delhi' },
    { id: 'task-2', title: 'Send property listings to Priya', task_type: 'Email', priority: 'Medium', lead_id: 'lead-2', status: 'In Progress', due_date: new Date(Date.now() + 172800000).toISOString(), description: 'Send 2BHK options in Mumbai' },
    { id: 'task-3', title: 'Schedule site visit for Sneha', task_type: 'Site Visit', priority: 'Urgent', lead_id: 'lead-4', status: 'Pending', due_date: new Date(Date.now() - 86400000).toISOString(), description: 'Schedule villa viewing in Pune' }
  );

  appointments.push(
    { id: 'appt-1', lead_id: 'lead-4', title: 'Villa Site Visit', appointment_type: 'Site Visit', scheduled_at: new Date(Date.now() + 172800000).toISOString(), duration_minutes: 60, location: 'Pune', status: 'Scheduled', notes: 'Bring property documents' },
    { id: 'appt-2', lead_id: 'lead-2', title: 'Discuss 2BHK options', appointment_type: 'Call', scheduled_at: new Date(Date.now() + 86400000).toISOString(), duration_minutes: 30, location: 'Phone', status: 'Scheduled', notes: 'Call at 3 PM' }
  );

  deals.push(
    { id: 'deal-1', lead_id: 'lead-5', title: 'Investment Property Deal', deal_value: 20000000, commission_percentage: 2, deal_stage: 'Negotiation', expected_close_date: new Date(Date.now() + 604800000).toISOString(), notes: 'High-value investment client' },
    { id: 'deal-2', lead_id: 'lead-4', title: '4BHK Villa Sale', deal_value: 25000000, commission_percentage: 2.5, deal_stage: 'Agreement', expected_close_date: new Date(Date.now() + 1209600000).toISOString(), notes: 'Client interested in luxury villa' }
  );

  emailTemplates.push(
    { id: 'tpl-1', name: 'Welcome Email', subject: 'Welcome to LeadPilot!', body: 'Hi {{name}},\n\nThank you for your interest. We have great properties for you.\n\nBest regards', type: 'email', is_active: true },
    { id: 'tpl-2', name: 'Follow-up', subject: 'Following up on your property search', body: 'Hi {{name}},\n\nJust checking in. Have you had a chance to review the properties?\n\nBest regards', type: 'email', is_active: true },
    { id: 'tpl-3', name: 'Welcome SMS', subject: '', body: 'Hi {{name}}, thanks for your interest in our properties. We will contact you soon!', type: 'sms', is_active: true }
  );
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, team_id: user.team_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'agent' } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (users.has(email)) return res.status(409).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: 'user-' + Date.now(), email, password: hashedPassword, name, role, team_id: null };
    users.set(email, user);
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    
    const user = users.get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, team_id: user.team_id }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = [...users.values()].find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, team_id: user.team_id } });
});

app.patch('/api/auth/profile', authenticateToken, async (req, res) => {
  const user = [...users.values()].find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email, phone } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  res.json({ message: 'Profile updated', user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
  const user = [...users.values()].find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return res.status(401).json({ error: 'Current password is incorrect' });
  user.password = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password changed successfully' });
});

// ============================================
// LEADS
// ============================================
app.get('/api/leads', (req, res) => {
  let result = [...leads];
  if (req.query.status && req.query.status !== 'all') result = result.filter(l => l.status === req.query.status);
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(l => l.phone?.toLowerCase().includes(s) || l.location?.toLowerCase().includes(s) || l.message?.toLowerCase().includes(s) || l.name?.toLowerCase().includes(s));
  }
  res.json(result);
});

app.get('/api/leads/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

app.post('/api/leads', (req, res) => {
  const lead = { id: 'lead-' + Date.now(), ...req.body, ai_score: Math.floor(Math.random() * 40) + 60, ai_priority: Math.random() > 0.5 ? 'hot' : 'warm', created_at: new Date().toISOString() };
  leads.unshift(lead);
  res.status(201).json(lead);
});

app.patch('/api/leads/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  Object.assign(lead, req.body);
  res.json(lead);
});

app.delete('/api/leads/:id', (req, res) => {
  const idx = leads.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  leads.splice(idx, 1);
  res.json({ message: 'Lead deleted' });
});

// ============================================
// PROPERTIES
// ============================================
app.get('/api/properties', (req, res) => {
  let result = [...properties];
  if (req.query.status && req.query.status !== 'all') result = result.filter(p => p.status === req.query.status);
  res.json(result);
});

app.post('/api/properties', (req, res) => {
  const prop = { id: 'prop-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  properties.push(prop);
  res.status(201).json(prop);
});

app.get('/api/properties/match/:leadId', (req, res) => {
  const lead = leads.find(l => l.id === req.params.leadId);
  if (!lead) return res.json([]);
  const matches = properties.filter(p => p.status === 'Available' && p.city?.toLowerCase() === lead.location?.toLowerCase());
  res.json(matches);
});

// ============================================
// TASKS
// ============================================
app.get('/api/tasks', (req, res) => {
  let result = [...tasks];
  if (req.query.lead_id) result = result.filter(t => t.lead_id === req.query.lead_id);
  if (req.query.status) result = result.filter(t => t.status === req.query.status);
  res.json(result);
});

app.post('/api/tasks', (req, res) => {
  const task = { id: 'task-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  Object.assign(task, req.body);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(idx, 1);
  res.json({ message: 'Task deleted' });
});

app.patch('/api/tasks/:id/complete', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.status = 'Completed';
  res.json(task);
});

app.get('/api/tasks/today/list', (req, res) => {
  const today = new Date().toDateString();
  res.json(tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === today && t.status !== 'Completed'));
});

// ============================================
// APPOINTMENTS
// ============================================
app.get('/api/appointments', (req, res) => {
  let result = [...appointments];
  if (req.query.lead_id) result = result.filter(a => a.lead_id === req.query.lead_id);
  res.json(result);
});

app.post('/api/appointments', (req, res) => {
  const appt = { id: 'appt-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  appointments.push(appt);
  res.status(201).json(appt);
});

app.patch('/api/appointments/:id', (req, res) => {
  const appt = appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  Object.assign(appt, req.body);
  res.json(appt);
});

app.patch('/api/appointments/:id/complete', (req, res) => {
  const appt = appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  appt.status = 'Completed';
  res.json(appt);
});

app.patch('/api/appointments/:id/cancel', (req, res) => {
  const appt = appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  appt.status = 'Cancelled';
  res.json(appt);
});

app.get('/api/appointments/stats/overview', (req, res) => {
  const today = new Date().toDateString();
  res.json({
    total: appointments.length,
    today: appointments.filter(a => new Date(a.scheduled_at).toDateString() === today).length,
    upcoming: appointments.filter(a => a.status === 'Scheduled').length
  });
});

// ============================================
// DEALS
// ============================================
app.get('/api/deals', (req, res) => {
  res.json(deals.map(d => { const lead = leads.find(l => l.id === d.lead_id); return { ...d, lead }; }));
});

app.post('/api/deals', (req, res) => {
  const deal = { id: 'deal-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  deals.push(deal);
  res.status(201).json(deal);
});

app.patch('/api/deals/:id', (req, res) => {
  const deal = deals.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  Object.assign(deal, req.body);
  res.json(deal);
});

app.patch('/api/deals/:id/close-won', (req, res) => {
  const deal = deals.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  deal.deal_stage = 'Closed Won';
  deal.actual_close_date = new Date().toISOString();
  res.json(deal);
});

app.patch('/api/deals/:id/close-lost', (req, res) => {
  const deal = deals.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  deal.deal_stage = 'Closed Lost';
  deal.actual_close_date = new Date().toISOString();
  res.json(deal);
});

app.get('/api/deals/commission/stats', (req, res) => {
  const totalCommission = deals.reduce((sum, d) => sum + ((d.deal_value || 0) * (d.commission_percentage || 2)) / 100, 0);
  res.json({
    totalDeals: deals.length,
    totalCommission,
    totalWon: deals.filter(d => d.deal_stage === 'Closed Won').length,
    totalPipelineValue: deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.deal_stage)).reduce((sum, d) => sum + (d.deal_value || 0), 0)
  });
});

// ============================================
// NOTES
// ============================================
app.get('/api/notes', (req, res) => {
  let result = [...notes];
  if (req.query.lead_id) result = result.filter(n => n.lead_id === req.query.lead_id);
  res.json(result);
});

app.post('/api/notes', (req, res) => {
  const note = { id: 'note-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  notes.push(note);
  res.status(201).json(note);
});

// ============================================
// EMAIL TEMPLATES
// ============================================
app.get('/api/email/templates', (req, res) => { res.json(emailTemplates); });
app.post('/api/email/templates', (req, res) => {
  const tpl = { id: 'tpl-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  emailTemplates.push(tpl);
  res.status(201).json(tpl);
});
app.delete('/api/email/templates/:id', (req, res) => {
  const idx = emailTemplates.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Template not found' });
  emailTemplates.splice(idx, 1);
  res.json({ message: 'Template deleted' });
});

// ============================================
// SMS
// ============================================
app.post('/api/sms/send', (req, res) => {
  smsLogs.push({ id: 'sms-' + Date.now(), to: req.body.to, message: req.body.body, status: 'sent', created_at: new Date().toISOString() });
  res.json({ success: true, message: 'SMS queued (demo mode)' });
});
app.get('/api/sms/logs', (req, res) => { res.json({ logs: smsLogs }); });
app.get('/api/sms/status', (req, res) => { res.json({ configured: false, message: 'Configure TWILIO credentials in .env' }); });

// ============================================
// WHATSAPP
// ============================================
app.get('/api/whatsapp/status', (req, res) => { res.json({ connected: false, configured: false, message: 'Configure WhatsApp in .env' }); });
app.get('/api/whatsapp/settings', (req, res) => { res.json({ configured: false }); });
app.get('/api/whatsapp/webhook-url', (req, res) => { res.json({ url: `${req.protocol}://${req.get('host')}/webhook` }); });

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'leadpilot_webhook_verify_token') {
    res.send(req.query['hub.challenge']);
  } else { res.sendStatus(403); }
});

app.post('/webhook', (req, res) => {
  if (req.body.entry && req.body.entry[0]?.changes) {
    req.body.entry[0].changes.forEach(change => {
      if (change.value?.messages) {
        change.value.messages.forEach(msg => {
          leads.unshift({
            id: 'lead-' + Date.now(), phone: msg.from, message: msg.text?.body || '',
            name: '', email: '', budget: null, location: null, status: 'new',
            ai_score: Math.floor(Math.random() * 40) + 60, ai_priority: 'warm', created_at: new Date().toISOString()
          });
        });
      }
    });
  }
  res.sendStatus(200);
});

// ============================================
// ANALYTICS
// ============================================
app.get('/api/analytics/dashboard', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const cutoff = new Date(Date.now() - days * 86400000);
  const recentLeads = leads.filter(l => new Date(l.created_at) >= cutoff);
  
  const statusDist = [
    { name: 'New', value: recentLeads.filter(l => l.status === 'new').length, color: '#3b82f6' },
    { name: 'Contacted', value: recentLeads.filter(l => l.status === 'contacted').length, color: '#f59e0b' },
    { name: 'Follow-up', value: recentLeads.filter(l => l.status === 'follow-up').length, color: '#8b5cf6' },
    { name: 'Closed', value: recentLeads.filter(l => l.status === 'closed').length, color: '#10b981' }
  ];

  const scores = recentLeads.map(l => l.ai_score || 0);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const leadsByDay = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dayLeads = leads.filter(l => new Date(l.created_at).toDateString() === date.toDateString());
    leadsByDay.push({
      date: date.toISOString(),
      new: dayLeads.filter(l => l.status === 'new').length,
      contacted: dayLeads.filter(l => l.status === 'contacted').length,
      closed: dayLeads.filter(l => l.status === 'closed').length
    });
  }

  const locations = {};
  leads.forEach(l => { if (l.location) locations[l.location] = (locations[l.location] || 0) + 1; });
  const sources = Object.entries(locations).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const closed = recentLeads.filter(l => l.status === 'closed').length;
  const conversionRate = recentLeads.length ? Math.round((closed / recentLeads.length) * 100) : 0;

  res.json({
    metrics: { totalLeads: leads.length, conversionRate, avgScore },
    statusDistribution: statusDist,
    scoreDistribution: {
      averageScore: avgScore,
      distribution: {
        hot: recentLeads.filter(l => (l.ai_score || 0) >= 80).length,
        warm: recentLeads.filter(l => (l.ai_score || 0) >= 60 && (l.ai_score || 0) < 80).length,
        cold: recentLeads.filter(l => (l.ai_score || 0) >= 40 && (l.ai_score || 0) < 60).length,
        nurture: recentLeads.filter(l => (l.ai_score || 0) < 40).length
      }
    },
    leadsByDay,
    sources,
    recentActivity: leads.slice(0, 5).map(l => ({ type: 'new_lead', description: `New lead: ${l.phone}`, created_at: l.created_at, icon: 'user-plus' }))
  });
});

app.get('/api/analytics/performance', (req, res) => { res.json({ memberPerformance: [] }); });

app.get('/api/analytics/insights', (req, res) => {
  const budgetRanges = {};
  leads.forEach(l => { if (l.budget) budgetRanges[l.budget] = (budgetRanges[l.budget] || 0) + 1; });
  res.json({
    budgetRanges,
    recommendations: ['Focus on hot leads (80+ score)', 'Follow up with leads older than 7 days', 'Expand to top-performing locations']
  });
});

// ============================================
// SETTINGS
// ============================================
app.get('/api/settings', authenticateToken, (req, res) => {
  const s = settings[req.user.id] || {};
  res.json({ settings: { newLeadAlert: s.newLeadAlert ?? true, followUpReminder: s.followUpReminder ?? true, highPriorityAlert: s.highPriorityAlert ?? true, dailySummary: s.dailySummary ?? false, taskReminders: s.taskReminders ?? true, appointmentReminders: s.appointmentReminders ?? true, weeklyReport: s.weeklyReport ?? false } });
});

app.post('/api/settings', authenticateToken, (req, res) => {
  settings[req.user.id] = req.body.settings || {};
  res.json({ message: 'Settings saved' });
});

app.get('/api/settings/notifications', authenticateToken, (req, res) => {
  const s = settings[req.user.id] || {};
  res.json({ settings: { newLeadAlert: s.newLeadAlert ?? true, followUpReminder: s.followUpReminder ?? true, highPriorityAlert: s.highPriorityAlert ?? true, dailySummary: s.dailySummary ?? false, taskReminders: s.taskReminders ?? true, appointmentReminders: s.appointmentReminders ?? true, weeklyReport: s.weeklyReport ?? false } });
});

app.post('/api/settings/notifications', authenticateToken, (req, res) => {
  settings[req.user.id] = req.body.settings || {};
  res.json({ message: 'Notification preferences saved' });
});

// ============================================
// TEAM
// ============================================
app.get('/api/team', authenticateToken, (req, res) => { res.json({ team: { id: 'team-1', name: 'My Real Estate Team', members: [] } }); });
app.post('/api/team', authenticateToken, (req, res) => { res.status(201).json({ message: 'Team created', team: { id: 'team-' + Date.now(), ...req.body } }); });

// ============================================
// IMPORT/EXPORT
// ============================================
app.post('/api/import/leads', authenticateToken, (req, res) => { res.json({ message: 'Import successful (demo)', imported: 0 }); });
app.get('/api/import/export', authenticateToken, (req, res) => {
  const csv = 'phone,name,email,location,budget,status\n' + leads.map(l => `${l.phone},${l.name || ''},${l.email || ''},${l.location || ''},${l.budget || ''},${l.status}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

// ============================================
// REPORTS
// ============================================
app.get('/api/reports', authenticateToken, (req, res) => { res.json({ message: 'Report generated (demo)', data: { leads: leads.length, properties: properties.length } }); });

// ============================================
// SEQUENCES
// ============================================
app.get('/api/sequences', authenticateToken, (req, res) => { res.json([]); });
app.post('/api/sequences', authenticateToken, (req, res) => { res.status(201).json({ message: 'Sequence created', sequence: req.body }); });

// ============================================
// GOALS
// ============================================
app.get('/api/goals', authenticateToken, (req, res) => { res.json([]); });
app.post('/api/goals', authenticateToken, (req, res) => { res.status(201).json({ message: 'Goal created', goal: req.body }); });

// ============================================
// HEALTH
// ============================================
app.get('/health', (req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'demo' }); });

// ============================================
// PAGES
// ============================================
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

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 80;

seedData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 LeadPilot AI CRM running on http://localhost:${PORT}`);
    console.log(`📊 Mode: DEMO (in-memory, no database needed)`);
    console.log(`👤 Demo login: admin@leadpilot.ai / admin123`);
  });
});
