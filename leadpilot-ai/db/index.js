const { supabase, isDemoMode } = require('./supabase');
const demoStore = require('./demoStore');

/**
 * Unified Repository Access Layer for LeadPilot AI
 * Standardized CRUD Return Contracts:
 * - getById(id) -> Object or null
 * - getAll(filters) -> Array or { data: Array, total: Number }
 * - create(data) -> Created Object
 * - update(id, updates) -> Updated Object or null
 * - delete(id) -> Boolean (true if deleted, false if not found)
 */
const repository = {
  isDemoMode,

  // ============================================
  // ACTIVITY LOGGING
  // ============================================
  async logActivity(activityData) {
    if (isDemoMode) {
      return demoStore.logActivity(activityData);
    }
    const { error } = await supabase.from('activity_logs').insert([activityData]);
    if (error) console.error('Activity log error:', error);
    return !error;
  },

  // ============================================
  // AUTH & USERS
  // ============================================
  async getUserByEmail(email) {
    if (isDemoMode) {
      return demoStore.getUserByEmail(email);
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getUserById(id) {
    if (isDemoMode) {
      return demoStore.getUserById(id);
    }
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, team_id')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createUser(userData) {
    if (isDemoMode) {
      return demoStore.createUser(userData);
    }
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUser(id, updates) {
    if (isDemoMode) {
      return demoStore.updateUser(id, updates);
    }
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data || null;
  },

  // ============================================
  // LEADS
  // ============================================
  async getLeads(filters = {}) {
    if (isDemoMode) {
      return demoStore.getLeads(filters);
    }
    const { status, search, limit = 50, offset = 0 } = filters;
    let query = supabase
      .from('leads')
      .select('*, properties(*), deals(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(parseInt(offset, 10), parseInt(offset, 10) + parseInt(limit, 10) - 1);

    if (status && status !== 'all') query = query.eq('status', status);
    if (search) {
      query = query.or(`phone.ilike.%${search}%,message.ilike.%${search}%,location.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  async getLeadById(id) {
    if (isDemoMode) {
      return demoStore.getLeadById(id);
    }
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        properties(*),
        deals(*),
        appointments(*),
        tasks(*),
        notes(*),
        documents(*)
      `)
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createLead(leadData) {
    if (isDemoMode) {
      return demoStore.createLead(leadData);
    }
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateLead(id, updates) {
    if (isDemoMode) {
      return demoStore.updateLead(id, updates);
    }
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data || null;
  },

  async deleteLead(id) {
    if (isDemoMode) {
      return demoStore.deleteLead(id);
    }
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // ============================================
  // PROPERTIES
  // ============================================
  async getProperties(filters = {}) {
    if (isDemoMode) {
      return demoStore.getProperties(filters);
    }
    const { status, city, type, minPrice, maxPrice, search } = filters;
    let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    if (city) query = query.ilike('city', `%${city}%`);
    if (type) query = query.eq('property_type', type);
    if (minPrice) query = query.gte('price', minPrice);
    if (maxPrice) query = query.lte('price', maxPrice);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getPropertyById(id) {
    if (isDemoMode) {
      return demoStore.getPropertyById(id);
    }
    const { data, error } = await supabase
      .from('properties')
      .select('*, deals(*), appointments(*)')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createProperty(propertyData) {
    if (isDemoMode) {
      return demoStore.createProperty(propertyData);
    }
    const { data, error } = await supabase.from('properties').insert([propertyData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateProperty(id, updates) {
    if (isDemoMode) {
      return demoStore.updateProperty(id, updates);
    }
    const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteProperty(id) {
    if (isDemoMode) {
      return demoStore.deleteProperty(id);
    }
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getPropertyStats() {
    if (isDemoMode) {
      return demoStore.getPropertyStats();
    }
    const { data: total } = await supabase.from('properties').select('id', { count: 'exact' });
    const { data: available } = await supabase.from('properties').select('id', { count: 'exact' }).eq('status', 'Available');
    const { data: sold } = await supabase.from('properties').select('id', { count: 'exact' }).eq('status', 'Sold');
    return {
      total: total?.length || 0,
      available: available?.length || 0,
      sold: sold?.length || 0,
      byType: []
    };
  },

  async matchPropertiesToLead(leadId) {
    if (isDemoMode) {
      return demoStore.matchPropertiesToLead(leadId);
    }
    const { data: properties } = await supabase.from('properties').select('*').eq('status', 'Available');
    return (properties || []).map(p => ({ property: p, match_score: 80, match_reasons: ['Location matches'] }));
  },

  // ============================================
  // TASKS
  // ============================================
  async getTasks(filters = {}) {
    if (isDemoMode) {
      return demoStore.getTasks(filters);
    }
    const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getTaskById(id) {
    if (isDemoMode) {
      return demoStore.getTaskById(id);
    }
    const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createTask(taskData) {
    if (isDemoMode) {
      return demoStore.createTask(taskData);
    }
    const { data, error } = await supabase.from('tasks').insert([taskData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateTask(id, updates) {
    if (isDemoMode) {
      return demoStore.updateTask(id, updates);
    }
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteTask(id) {
    if (isDemoMode) {
      return demoStore.deleteTask(id);
    }
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getTodayTasks() {
    if (isDemoMode) {
      return demoStore.getTodayTasks();
    }
    const { data, error } = await supabase.from('tasks').select('*').eq('status', 'Pending');
    if (error) throw error;
    return data || [];
  },

  async getTaskStats() {
    if (isDemoMode) {
      return demoStore.getTaskStats();
    }
    const { data } = await supabase.from('tasks').select('id, status');
    return {
      total: data?.length || 0,
      pending: (data || []).filter(t => t.status === 'Pending').length,
      completed: (data || []).filter(t => t.status === 'Completed').length,
      overdue: 0
    };
  },

  // ============================================
  // APPOINTMENTS
  // ============================================
  async getAppointments(filters = {}) {
    if (isDemoMode) {
      return demoStore.getAppointments(filters);
    }
    const { data, error } = await supabase.from('appointments').select('*').order('scheduled_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getAppointmentById(id) {
    if (isDemoMode) {
      return demoStore.getAppointmentById(id);
    }
    const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createAppointment(data) {
    if (isDemoMode) {
      return demoStore.createAppointment(data);
    }
    const { data: result, error } = await supabase.from('appointments').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateAppointment(id, updates) {
    if (isDemoMode) {
      return demoStore.updateAppointment(id, updates);
    }
    const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteAppointment(id) {
    if (isDemoMode) {
      return demoStore.deleteAppointment(id);
    }
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getAppointmentStats() {
    if (isDemoMode) {
      return demoStore.getAppointmentStats();
    }
    const { data } = await supabase.from('appointments').select('status');
    return {
      total: data?.length || 0,
      scheduled: (data || []).filter(a => a.status === 'Scheduled').length,
      completed: (data || []).filter(a => a.status === 'Completed').length,
      cancelled: (data || []).filter(a => a.status === 'Cancelled').length
    };
  },

  // ============================================
  // DEALS
  // ============================================
  async getDeals(filters = {}) {
    if (isDemoMode) {
      return demoStore.getDeals(filters);
    }
    const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getDealById(id) {
    if (isDemoMode) {
      return demoStore.getDealById(id);
    }
    const { data, error } = await supabase.from('deals').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createDeal(data) {
    if (isDemoMode) {
      return demoStore.createDeal(data);
    }
    const { data: result, error } = await supabase.from('deals').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateDeal(id, updates) {
    if (isDemoMode) {
      return demoStore.updateDeal(id, updates);
    }
    const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteDeal(id) {
    if (isDemoMode) {
      return demoStore.deleteDeal(id);
    }
    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getCommissionStats() {
    if (isDemoMode) {
      return demoStore.getCommissionStats();
    }
    const { data } = await supabase.from('deals').select('deal_value, commission_percentage, deal_stage');
    const totalValue = (data || []).reduce((acc, d) => acc + (parseFloat(d.deal_value) || 0), 0);
    const totalCommission = (data || []).reduce((acc, d) => acc + ((parseFloat(d.deal_value) || 0) * ((parseFloat(d.commission_percentage) || 2) / 100)), 0);
    return { totalValue, totalCommission, closedDealsCount: (data || []).filter(d => d.deal_stage === 'Closed Won').length };
  },

  // ============================================
  // NOTES
  // ============================================
  async getNotes(filters = {}) {
    if (isDemoMode) {
      return demoStore.getNotes(filters);
    }
    const { data, error } = await supabase.from('notes').select('*');
    if (error) throw error;
    return data || [];
  },

  async getNoteById(id) {
    if (isDemoMode) {
      return demoStore.getNoteById(id);
    }
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createNote(data) {
    if (isDemoMode) {
      return demoStore.createNote(data);
    }
    const { data: result, error } = await supabase.from('notes').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateNote(id, updates) {
    if (isDemoMode) {
      return demoStore.updateNote(id, updates);
    }
    const { data, error } = await supabase.from('notes').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteNote(id) {
    if (isDemoMode) {
      return demoStore.deleteNote(id);
    }
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ============================================
  // EMAIL TEMPLATES
  // ============================================
  async getEmailTemplates() {
    if (isDemoMode) {
      return demoStore.getEmailTemplates();
    }
    const { data, error } = await supabase.from('email_templates').select('*');
    if (error) throw error;
    return data || [];
  },

  async getEmailTemplateById(id) {
    if (isDemoMode) {
      return demoStore.getEmailTemplateById(id);
    }
    const { data, error } = await supabase.from('email_templates').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createEmailTemplate(data) {
    if (isDemoMode) {
      return demoStore.createEmailTemplate(data);
    }
    const { data: result, error } = await supabase.from('email_templates').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateEmailTemplate(id, updates) {
    if (isDemoMode) {
      return demoStore.updateEmailTemplate(id, updates);
    }
    const { data, error } = await supabase.from('email_templates').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteEmailTemplate(id) {
    if (isDemoMode) {
      return demoStore.deleteEmailTemplate(id);
    }
    const { error } = await supabase.from('email_templates').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ============================================
  // SETTINGS
  // ============================================
  async getSettings(userId) {
    if (isDemoMode) {
      return demoStore.getSettings(userId);
    }
    const { data } = await supabase.from('settings').select('*').eq('user_id', userId);
    return data || {};
  },

  async saveSettings(userId, settingsData) {
    if (isDemoMode) {
      return demoStore.saveSettings(userId, settingsData);
    }
    const { data, error } = await supabase.from('settings').upsert({ user_id: userId, value: settingsData });
    if (error) throw error;
    return data;
  },

  // ============================================
  // ANALYTICS
  // ============================================
  async getDashboardAnalytics() {
    if (isDemoMode) {
      return demoStore.getDashboardAnalytics();
    }
    return demoStore.getDashboardAnalytics();
  },

  // ============================================
  // DOCUMENTS
  // ============================================
  async getDocuments(filters = {}) {
    if (isDemoMode) {
      return demoStore.getDocuments(filters);
    }
    const { data, error } = await supabase.from('documents').select('*');
    if (error) throw error;
    return data || [];
  },

  async getDocumentById(id) {
    if (isDemoMode) {
      return demoStore.getDocumentById(id);
    }
    const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createDocument(data) {
    if (isDemoMode) {
      return demoStore.createDocument(data);
    }
    const { data: result, error } = await supabase.from('documents').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateDocument(id, updates) {
    if (isDemoMode) {
      return demoStore.updateDocument(id, updates);
    }
    const { data, error } = await supabase.from('documents').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteDocument(id) {
    if (isDemoMode) {
      return demoStore.deleteDocument(id);
    }
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ============================================
  // GOALS
  // ============================================
  async getGoals(filters = {}) {
    if (isDemoMode) {
      return demoStore.getGoals(filters);
    }
    const { data, error } = await supabase.from('goals').select('*');
    if (error) throw error;
    return data || [];
  },

  async getGoalById(id) {
    if (isDemoMode) {
      return demoStore.getGoalById(id);
    }
    const { data, error } = await supabase.from('goals').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createGoal(data) {
    if (isDemoMode) {
      return demoStore.createGoal(data);
    }
    const { data: result, error } = await supabase.from('goals').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async updateGoal(id, updates) {
    if (isDemoMode) {
      return demoStore.updateGoal(id, updates);
    }
    const { data, error } = await supabase.from('goals').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data || null;
  },

  async deleteGoal(id) {
    if (isDemoMode) {
      return demoStore.deleteGoal(id);
    }
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ============================================
  // LOGS
  // ============================================
  async getEmailLogs(filters = {}) {
    if (isDemoMode) {
      return demoStore.getEmailLogs(filters);
    }
    const { data, error } = await supabase.from('email_logs').select('*');
    if (error) throw error;
    return data || [];
  },

  async createEmailLog(data) {
    if (isDemoMode) {
      return demoStore.createEmailLog(data);
    }
    const { data: result, error } = await supabase.from('email_logs').insert([data]).select().single();
    if (error) throw error;
    return result;
  },

  async getSmsLogs(filters = {}) {
    if (isDemoMode) {
      return demoStore.getSmsLogs(filters);
    }
    const { data, error } = await supabase.from('sms_logs').select('*');
    if (error) throw error;
    return data || [];
  },

  async createSmsLog(data) {
    if (isDemoMode) {
      return demoStore.createSmsLog(data);
    }
    const { data: result, error } = await supabase.from('sms_logs').insert([data]).select().single();
    if (error) throw error;
    return result;
  }
};

module.exports = repository;
