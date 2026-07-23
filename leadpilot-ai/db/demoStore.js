const bcrypt = require('bcryptjs');

// ============================================
// DEMO STORE - In-memory state
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
const activityLogs = [];
const goals = [];
const sequences = [];
const documents = [];
const whatsappLogs = [];

// Seed demo data
async function seedData() {
  if (users.size > 0) return; // Prevent double seeding

  const hash = await bcrypt.hash('admin123', 10);
  users.set('admin@leadpilot.ai', {
    id: 'user-1',
    email: 'admin@leadpilot.ai',
    password: hash,
    name: 'Admin User',
    role: 'admin',
    team_id: 'team-1'
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

// Auto-seed on load to support serverless warm starts
seedData().catch(console.error);

// ============================================
// DEMO STORE METHODS (Standard Repository Interface)
// ============================================
const demoStore = {
  users,
  leads,
  properties,
  tasks,
  appointments,
  deals,
  notes,
  emailTemplates,
  smsLogs,
  settings,
  activityLogs,
  goals,
  sequences,
  documents,
  whatsappLogs,

  seedData,

  // Activity Logging
  async logActivity(data) {
    activityLogs.unshift({ id: 'act-' + Date.now(), created_at: new Date().toISOString(), ...data });
    return true;
  },

  // Auth & Users
  async getUserByEmail(email) {
    return users.get(email) || null;
  },

  async getUserById(id) {
    return [...users.values()].find(u => u.id === id) || null;
  },

  async createUser(userData) {
    const user = {
      id: userData.id || 'user-' + Date.now(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role || 'agent',
      team_id: userData.team_id || null,
      created_at: new Date().toISOString()
    };
    users.set(user.email, user);
    return user;
  },

  async updateUser(id, updates) {
    const user = await this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  },

  // Leads
  async getLeads(filters = {}) {
    let result = [...leads];
    if (filters.status && filters.status !== 'all') {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(l =>
        (l.name && l.name.toLowerCase().includes(term)) ||
        (l.phone && l.phone.includes(term)) ||
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.location && l.location.toLowerCase().includes(term))
      );
    }
    const offset = parseInt(filters.offset || 0, 10);
    const limit = parseInt(filters.limit || 50, 10);
    return { data: result.slice(offset, offset + limit), total: result.length };
  },

  async getLeadById(id) {
    return leads.find(l => l.id === id) || null;
  },

  async createLead(leadData) {
    const lead = {
      id: leadData.id || 'lead-' + Date.now(),
      phone: leadData.phone,
      name: leadData.name || '',
      email: leadData.email || '',
      message: leadData.message || '',
      budget: leadData.budget || null,
      location: leadData.location || '',
      status: leadData.status || 'new',
      ai_score: leadData.ai_score || 50,
      ai_priority: leadData.ai_priority || 'warm',
      created_at: new Date().toISOString(),
      ...leadData
    };
    leads.unshift(lead);
    return lead;
  },

  async updateLead(id, updates) {
    const lead = await this.getLeadById(id);
    if (!lead) return null;
    Object.assign(lead, updates, { updated_at: new Date().toISOString() });
    return lead;
  },

  async deleteLead(id) {
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) return false;
    leads.splice(index, 1);
    return true;
  },

  // Properties
  async getProperties(filters = {}) {
    let result = [...properties];
    if (filters.status) result = result.filter(p => p.status === filters.status);
    if (filters.city) result = result.filter(p => p.city && p.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.type) result = result.filter(p => p.property_type === filters.type);
    return result;
  },

  async getPropertyById(id) {
    return properties.find(p => p.id === id) || null;
  },

  async createProperty(propertyData) {
    const prop = { id: 'prop-' + Date.now(), created_at: new Date().toISOString(), ...propertyData };
    properties.unshift(prop);
    return prop;
  },

  async updateProperty(id, updates) {
    const prop = await this.getPropertyById(id);
    if (!prop) return null;
    Object.assign(prop, updates, { updated_at: new Date().toISOString() });
    return prop;
  },

  async deleteProperty(id) {
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) return false;
    properties.splice(index, 1);
    return true;
  },

  async getPropertyStats() {
    return {
      total: properties.length,
      available: properties.filter(p => p.status === 'Available').length,
      sold: properties.filter(p => p.status === 'Sold').length,
      byType: []
    };
  },

  async matchPropertiesToLead(leadId) {
    const lead = await this.getLeadById(leadId);
    if (!lead) return [];
    return properties.map(prop => ({
      property: prop,
      match_score: 85,
      match_reasons: ['Location matches', 'Within budget']
    }));
  },

  // Tasks
  async getTasks(filters = {}) {
    let result = [...tasks];
    if (filters.status) result = result.filter(t => t.status === filters.status);
    return result;
  },

  async getTaskById(id) {
    return tasks.find(t => t.id === id) || null;
  },

  async createTask(taskData) {
    const task = { id: 'task-' + Date.now(), status: 'Pending', created_at: new Date().toISOString(), ...taskData };
    tasks.unshift(task);
    return task;
  },

  async updateTask(id, updates) {
    const task = await this.getTaskById(id);
    if (!task) return null;
    Object.assign(task, updates, { updated_at: new Date().toISOString() });
    return task;
  },

  async deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },

  async getTodayTasks() {
    return tasks.filter(t => t.status === 'Pending');
  },

  async getTaskStats() {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => new Date(t.due_date) < new Date() && t.status === 'Pending').length
    };
  },

  // Appointments
  async getAppointments(filters = {}) {
    let result = [...appointments];
    if (filters.status) result = result.filter(a => a.status === filters.status);
    return result;
  },

  async getAppointmentById(id) {
    return appointments.find(a => a.id === id) || null;
  },

  async createAppointment(data) {
    const appt = { id: 'appt-' + Date.now(), status: 'Scheduled', created_at: new Date().toISOString(), ...data };
    appointments.unshift(appt);
    return appt;
  },

  async updateAppointment(id, updates) {
    const appt = await this.getAppointmentById(id);
    if (!appt) return null;
    Object.assign(appt, updates, { updated_at: new Date().toISOString() });
    return appt;
  },

  async deleteAppointment(id) {
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return false;
    appointments.splice(index, 1);
    return true;
  },

  async getAppointmentStats() {
    return {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'Scheduled').length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length
    };
  },

  // Deals
  async getDeals(filters = {}) {
    let result = [...deals];
    if (filters.stage) result = result.filter(d => d.deal_stage === filters.stage);
    return result;
  },

  async getDealById(id) {
    return deals.find(d => d.id === id) || null;
  },

  async createDeal(data) {
    const deal = { id: 'deal-' + Date.now(), deal_stage: 'New', created_at: new Date().toISOString(), ...data };
    deals.unshift(deal);
    return deal;
  },

  async updateDeal(id, updates) {
    const deal = await this.getDealById(id);
    if (!deal) return null;
    Object.assign(deal, updates, { updated_at: new Date().toISOString() });
    return deal;
  },

  async deleteDeal(id) {
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) return false;
    deals.splice(index, 1);
    return true;
  },

  async getCommissionStats() {
    const totalValue = deals.reduce((acc, d) => acc + (parseFloat(d.deal_value) || 0), 0);
    const totalCommission = deals.reduce((acc, d) => acc + ((parseFloat(d.deal_value) || 0) * ((parseFloat(d.commission_percentage) || 2) / 100)), 0);
    return { totalValue, totalCommission, closedDealsCount: deals.filter(d => d.deal_stage === 'Closed Won').length };
  },

  // Notes
  async getNotes(filters = {}) {
    let result = [...notes];
    if (filters.lead_id) result = result.filter(n => n.lead_id === filters.lead_id);
    return result;
  },

  async getNoteById(id) {
    return notes.find(n => n.id === id) || null;
  },

  async createNote(data) {
    const note = { id: 'note-' + Date.now(), created_at: new Date().toISOString(), ...data };
    notes.unshift(note);
    return note;
  },

  async updateNote(id, updates) {
    const note = await this.getNoteById(id);
    if (!note) return null;
    Object.assign(note, updates);
    return note;
  },

  async deleteNote(id) {
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return false;
    notes.splice(index, 1);
    return true;
  },

  // Email Templates
  async getEmailTemplates() {
    return [...emailTemplates];
  },

  async getEmailTemplateById(id) {
    return emailTemplates.find(t => t.id === id) || null;
  },

  async createEmailTemplate(data) {
    const tpl = { id: 'tpl-' + Date.now(), is_active: true, created_at: new Date().toISOString(), ...data };
    emailTemplates.unshift(tpl);
    return tpl;
  },

  async updateEmailTemplate(id, updates) {
    const tpl = await this.getEmailTemplateById(id);
    if (!tpl) return null;
    Object.assign(tpl, updates);
    return tpl;
  },

  async deleteEmailTemplate(id) {
    const index = emailTemplates.findIndex(t => t.id === id);
    if (index === -1) return false;
    emailTemplates.splice(index, 1);
    return true;
  },

  // Settings
  async getSettings(userId) {
    const s = settings[userId] || {};
    return {
      newLeadAlert: s.newLeadAlert ?? true,
      followUpReminder: s.followUpReminder ?? true,
      highPriorityAlert: s.highPriorityAlert ?? true,
      dailySummary: s.dailySummary ?? false,
      taskReminders: s.taskReminders ?? true,
      appointmentReminders: s.appointmentReminders ?? true,
      weeklyReport: s.weeklyReport ?? false
    };
  },

  async saveSettings(userId, newSettings) {
    settings[userId] = { ...settings[userId], ...newSettings };
    return this.getSettings(userId);
  },

  // Analytics
  async getDashboardAnalytics() {
    return {
      totalLeads: leads.length,
      activeProperties: properties.length,
      pendingTasks: tasks.filter(t => t.status === 'Pending').length,
      scheduledAppointments: appointments.filter(a => a.status === 'Scheduled').length,
      dealsPipeline: deals.length,
      averageScore: 74,
      distribution: { hot: 2, warm: 2, cold: 1 }
    };
  },

  // Documents
  async getDocuments(filters = {}) {
    let result = [...documents];
    if (filters.lead_id) result = result.filter(d => d.lead_id === filters.lead_id);
    if (filters.property_id) result = result.filter(d => d.property_id === filters.property_id);
    if (filters.deal_id) result = result.filter(d => d.deal_id === filters.deal_id);
    if (filters.document_type) result = result.filter(d => d.document_type === filters.document_type);
    return result;
  },

  async getDocumentById(id) {
    return documents.find(d => d.id === id) || null;
  },

  async createDocument(data) {
    const doc = { id: 'doc-' + Date.now(), created_at: new Date().toISOString(), ...data };
    documents.unshift(doc);
    return doc;
  },

  async updateDocument(id, updates) {
    const doc = await this.getDocumentById(id);
    if (!doc) return null;
    Object.assign(doc, updates);
    return doc;
  },

  async deleteDocument(id) {
    const index = documents.findIndex(d => d.id === id);
    if (index === -1) return false;
    documents.splice(index, 1);
    return true;
  },

  // Goals
  async getGoals(filters = {}) {
    let result = [...goals];
    if (filters.period) result = result.filter(g => g.period === filters.period);
    return result;
  },

  async getGoalById(id) {
    return goals.find(g => g.id === id) || null;
  },

  async createGoal(data) {
    const goal = { id: 'goal-' + Date.now(), created_at: new Date().toISOString(), ...data };
    goals.unshift(goal);
    return goal;
  },

  async updateGoal(id, updates) {
    const goal = await this.getGoalById(id);
    if (!goal) return null;
    Object.assign(goal, updates);
    return goal;
  },

  async deleteGoal(id) {
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) return false;
    goals.splice(index, 1);
    return true;
  },

  // Logs
  async getEmailLogs(filters = {}) {
    return emailTemplates;
  },

  async createEmailLog(data) {
    return data;
  },

  async getSmsLogs(filters = {}) {
    return smsLogs;
  },

  async createSmsLog(data) {
    const log = { id: 'sms-' + Date.now(), created_at: new Date().toISOString(), ...data };
    smsLogs.unshift(log);
    return log;
  }
};

module.exports = demoStore;
