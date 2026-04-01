const axios = require('axios');
const { config } = require('../config');
const { supabase } = require('../db/supabase');

class WhatsAppBusinessService {
  constructor() {
    this.baseUrl = `https://graph.facebook.com/${config.whatsapp.apiVersion}`;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    this.accessToken = config.whatsapp.accessToken;
  }

  // Send a text message
  async sendTextMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: this.formatPhoneNumber(to),
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the message
      await this.logMessage(to, message, 'sent');
      
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  // Send a template message
  async sendTemplateMessage(to, templateName, languageCode = 'en', components = []) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: this.formatPhoneNumber(to),
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.logMessage(to, `Template: ${templateName}`, 'sent');
      
      return response.data;
    } catch (error) {
      console.error('Error sending template message:', error.response?.data || error.message);
      throw new Error('Failed to send template message');
    }
  }

  // Send a media message (image, document)
  async sendMediaMessage(to, mediaType, mediaUrl, caption = '') {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: this.formatPhoneNumber(to),
          type: mediaType,
          [mediaType]: {
            link: mediaUrl,
            caption
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.logMessage(to, `Media: ${mediaType}`, 'sent');
      
      return response.data;
    } catch (error) {
      console.error('Error sending media message:', error.response?.data || error.message);
      throw new Error('Failed to send media message');
    }
  }

  // Handle incoming webhook messages
  async handleIncomingMessage(payload) {
    try {
      const entry = payload.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (!messages || messages.length === 0) return;

      for (const message of messages) {
        const from = message.from;
        const messageType = message.type;
        const messageId = message.id;
        const timestamp = message.timestamp;

        let content = '';
        switch (messageType) {
          case 'text':
            content = message.text.body;
            break;
          case 'image':
            content = '[Image]';
            break;
          case 'document':
            content = '[Document]';
            break;
          case 'audio':
            content = '[Audio]';
            break;
          case 'video':
            content = '[Video]';
            break;
          default:
            content = `[${messageType}]`;
        }

        // Create lead from WhatsApp message
        await this.createLeadFromWhatsApp(from, content, messageType);
        
        // Send auto-reply if enabled
        await this.sendAutoReply(from);
      }
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  // Create lead from WhatsApp message
  async createLeadFromWhatsApp(phone, message, messageType) {
    try {
      // Check if lead already exists
      const { data: existingLead } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', phone)
        .single();

      if (existingLead) {
        // Add note to existing lead
        await supabase.from('notes').insert([{
          lead_id: existingLead.id,
          note_type: 'WhatsApp',
          content: message,
          created_at: new Date().toISOString()
        }]);
        return existingLead;
      }

      // Create new lead
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([{
          phone,
          message,
          source: 'whatsapp',
          status: 'new',
          ai_score: this.calculateAIScore(message),
          ai_priority: this.calculatePriority(message),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Add initial note
      await supabase.from('notes').insert([{
        lead_id: newLead.id,
        note_type: 'WhatsApp',
        content: `New lead from WhatsApp: ${message}`,
        created_at: new Date().toISOString()
      }]);

      return newLead;
    } catch (error) {
      console.error('Error creating lead from WhatsApp:', error);
      throw error;
    }
  }

  // Send auto-reply if enabled
  async sendAutoReply(to) {
    try {
      // Get settings from database
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'whatsapp_auto_reply')
        .single();

      if (!settings || !settings.value?.enabled) return;

      const welcomeMessage = settings.value.welcome_message || 
        'Thank you for contacting us! We will get back to you shortly.';

      await this.sendTextMessage(to, welcomeMessage);
    } catch (error) {
      console.error('Error sending auto-reply:', error);
    }
  }

  // Log message to database
  async logMessage(phone, content, direction) {
    try {
      await supabase.from('whatsapp_logs').insert([{
        phone,
        content,
        direction,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

  // Format phone number (remove + and spaces)
  formatPhoneNumber(phone) {
    return phone.replace(/\+/g, '').replace(/\s/g, '');
  }

  // Calculate AI score based on message content
  calculateAIScore(message) {
    let score = 50; // Base score
    
    // Keywords that indicate high intent
    const highIntentKeywords = ['buy', 'purchase', 'interested', 'budget', 'price', 'ready'];
    const mediumIntentKeywords = ['looking', 'searching', 'information', 'details'];
    
    const lowerMessage = message.toLowerCase();
    
    highIntentKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) score += 15;
    });
    
    mediumIntentKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) score += 5;
    });
    
    return Math.min(score, 100);
  }

  // Calculate priority based on AI score
  calculatePriority(message) {
    const score = this.calculateAIScore(message);
    if (score >= 80) return 'hot';
    if (score >= 60) return 'warm';
    return 'cold';
  }

  // Get message templates
  async getTemplates() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${config.whatsapp.businessAccountId}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching templates:', error.response?.data || error.message);
      throw new Error('Failed to fetch templates');
    }
  }
}

module.exports = new WhatsAppBusinessService();
