const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const whatsappService = require("../services/whatsappBusinessService");
const { config } = require("../config");
const repository = require("../db");

// All routes require authentication
router.use(authenticateToken);

// Get connection status
router.get("/status", async (req, res) => {
  try {
    const isConfigured = !!(config.whatsapp.accessToken && config.whatsapp.phoneNumberId);

    if (!isConfigured) {
      return res.json({
        configured: false,
        connected: false,
        message: 'WhatsApp Business API not configured. Please add credentials in .env file.',
        credentials: {
          accessToken: !!config.whatsapp.accessToken,
          phoneNumberId: !!config.whatsapp.phoneNumberId,
          businessAccountId: !!config.whatsapp.businessAccountId
        }
      });
    }

    const settings = await repository.getSettings(req.user.id);
    const connection = settings.whatsapp_connection || {};

    res.json({
      configured: true,
      connected: connection.connected || false,
      phoneNumber: connection.phoneNumber || config.whatsapp.phoneNumberId,
      connectedAt: connection.connectedAt || null,
      messageCount: connection.messageCount || 0,
      leadsCount: connection.leadsCount || 0,
      webhookUrl: `/api/whatsapp/webhook`
    });
  } catch (error) {
    console.error('Error getting WhatsApp status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// Connect WhatsApp
router.post("/connect", async (req, res) => {
  try {
    if (!config.whatsapp.accessToken || !config.whatsapp.phoneNumberId) {
      return res.status(503).json({
        status: 'not_configured',
        message: 'WhatsApp Business API credentials not configured.',
        setupInstructions: [
          '1. Create a Meta Business Account',
          '2. Set up a WhatsApp Business Account',
          '3. Add a phone number to your WhatsApp Business Account',
          '4. Generate a permanent access token',
          '5. Add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to .env'
        ]
      });
    }

    try {
      const response = await fetch(
        `${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.whatsapp.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      await repository.saveSettings(req.user.id, {
        whatsapp_connection: {
          connected: true,
          phoneNumber: data.PhoneNumber || config.whatsapp.phoneNumberId,
          connectedAt: new Date().toISOString(),
          messageCount: 0,
          leadsCount: 0
        }
      });

      res.json({
        status: 'connected',
        message: 'WhatsApp Business API connected successfully',
        phoneNumber: data.PhoneNumber,
        accountName: data.PhoneNumber
      });
    } catch (apiError) {
      return res.status(401).json({
        status: 'invalid_credentials',
        message: 'WhatsApp API credentials are invalid or expired.'
      });
    }
  } catch (error) {
    console.error('Error connecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to connect WhatsApp' });
  }
});

// Disconnect WhatsApp
router.post("/disconnect", async (req, res) => {
  try {
    await repository.saveSettings(req.user.id, { whatsapp_connection: { connected: false } });
    res.json({ message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

// Get settings
router.get("/settings", async (req, res) => {
  try {
    const settings = await repository.getSettings(req.user.id);
    const autoReply = settings.whatsapp_auto_reply || {};

    res.json({
      autoReply: autoReply.enabled || false,
      welcomeMessageEnabled: autoReply.welcomeMessageEnabled !== false,
      welcomeMessage: autoReply.welcomeMessage || 'Thank you for contacting us! We\'ll get back to you shortly with property options.'
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
    await repository.saveSettings(req.user.id, {
      whatsapp_auto_reply: {
        enabled: autoReply,
        welcomeMessageEnabled,
        welcomeMessage
      }
    });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Send message
router.post("/send", async (req, res) => {
  try {
    const { phone, message, template } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required' });
    }

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
    res.json({
      data: [],
      pagination: {
        total: 0,
        limit: 50,
        offset: 0
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
