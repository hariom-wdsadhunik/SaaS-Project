const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const whatsappService = require("../services/whatsappBusinessService");
const { config } = require("../config");

// All routes require authentication
router.use(authenticateToken);

// Get connection status
router.get("/status", async (req, res) => {
  try {
    // Get settings from database
    const { supabase } = require("../db/supabase");
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('key', 'whatsapp_connection')
      .single();

    res.json({
      connected: settings?.value?.connected || false,
      phoneNumber: settings?.value?.phoneNumber || null,
      connectedAt: settings?.value?.connectedAt || null,
      messageCount: settings?.value?.messageCount || 0,
      leadsCount: settings?.value?.leadsCount || 0
    });
  } catch (error) {
    console.error('Error getting WhatsApp status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// Connect WhatsApp (initiates connection process)
router.post("/connect", async (req, res) => {
  try {
    // In a real implementation, this would:
    // 1. Generate a QR code from WhatsApp Business API
    // 2. Store the connection request
    // 3. Return the QR code for the user to scan
    
    // For now, we'll simulate the connection process
    res.json({
      status: 'pending',
      message: 'Connection initiated. Please scan the QR code.',
      expiresIn: 60 // seconds
    });
  } catch (error) {
    console.error('Error connecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to initiate connection' });
  }
});

// Disconnect WhatsApp
router.post("/disconnect", async (req, res) => {
  try {
    const { supabase } = require("../db/supabase");
    
    // Update settings
    await supabase
      .from('settings')
      .upsert({
        user_id: req.user.id,
        key: 'whatsapp_connection',
        value: { connected: false },
        updated_at: new Date().toISOString()
      });

    res.json({ message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

// Get settings
router.get("/settings", async (req, res) => {
  try {
    const { supabase } = require("../db/supabase");
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('key', 'whatsapp_auto_reply')
      .single();

    res.json({
      autoReply: settings?.value?.enabled || false,
      welcomeMessageEnabled: settings?.value?.welcomeMessageEnabled !== false,
      welcomeMessage: settings?.value?.welcomeMessage || 'Thank you for contacting us! We\'ll get back to you shortly with property options.'
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update settings
router.patch("/settings", async (req, res) => {
  try {
    const { autoReply, welcomeMessageEnabled, welcomeMessage } = req.body;
    const { supabase } = require("../db/supabase");

    await supabase
      .from('settings')
      .upsert({
        user_id: req.user.id,
        key: 'whatsapp_auto_reply',
        value: {
          enabled: autoReply,
          welcomeMessageEnabled,
          welcomeMessage
        },
        updated_at: new Date().toISOString()
      });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Send message to a lead
router.post("/send", async (req, res) => {
  try {
    const { phone, message, template } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required' });
    }

    // Check if WhatsApp is configured
    if (!config.whatsapp.accessToken || !config.whatsapp.phoneNumberId) {
      return res.status(503).json({ 
        error: 'WhatsApp Business API not configured',
        message: 'Please configure WhatsApp Business API credentials'
      });
    }

    let result;
    if (template) {
      result = await whatsappService.sendTemplateMessage(phone, template);
    } else {
      result = await whatsappService.sendTextMessage(phone, message);
    }

    res.json({
      message: 'Message sent successfully',
      messageId: result.messages?.[0]?.id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

// Get message templates
router.get("/templates", async (req, res) => {
  try {
    if (!config.whatsapp.accessToken) {
      return res.status(503).json({ 
        error: 'WhatsApp Business API not configured' 
      });
    }

    const templates = await whatsappService.getTemplates();
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get message history
router.get("/history", async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const { supabase } = require("../db/supabase");

    const { data, error, count } = await supabase
      .from('whatsapp_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
