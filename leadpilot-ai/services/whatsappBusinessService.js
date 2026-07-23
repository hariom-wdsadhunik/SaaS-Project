const { config } = require("../config");
const repository = require("../db");

class WhatsAppBusinessService {
  constructor() {
    this.accessToken = config.whatsapp.accessToken;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    this.apiVersion = config.whatsapp.apiVersion || "v18.0";
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  isConfigured() {
    return !!(this.accessToken && this.phoneNumberId);
  }

  async sendTextMessage(to, text) {
    if (!this.isConfigured()) {
      throw new Error("WhatsApp Business API not configured. Please set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.");
    }

    const formattedNumber = this.formatPhoneNumber(to);
    const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedNumber,
      type: "text",
      text: {
        preview_url: false,
        body: text,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("WhatsApp API Error Response:", data);
        throw new Error(data.error?.message || "Failed to send WhatsApp message");
      }

      await this.logMessage(formattedNumber, text, "outbound");

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        to: formattedNumber,
      };
    } catch (error) {
      console.error("WhatsApp text message send error:", error);
      throw error;
    }
  }

  async sendTemplateMessage(to, templateName, languageCode = "en", components = []) {
    if (!this.isConfigured()) {
      throw new Error("WhatsApp Business API not configured");
    }

    const formattedNumber = this.formatPhoneNumber(to);
    const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedNumber,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to send WhatsApp template");
      }

      await this.logMessage(formattedNumber, `Template: ${templateName}`, "outbound");

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        to: formattedNumber,
      };
    } catch (error) {
      console.error("WhatsApp template message send error:", error);
      throw error;
    }
  }

  async handleWebhookEvent(body) {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (!value || !value.messages) {
        return { processed: false, reason: "No messages in payload" };
      }

      const results = [];

      for (const message of value.messages) {
        if (message.type === "text") {
          const from = message.from;
          const text = message.text?.body;

          await this.logMessage(from, text, "inbound");
          const lead = await this.createLeadFromMessage(from, text);
          await this.sendAutoReply(from);

          results.push({ from, messageId: message.id, leadId: lead?.id });
        }
      }

      return { processed: true, count: results.length, results };
    } catch (error) {
      console.error("Error processing WhatsApp webhook:", error);
      throw error;
    }
  }

  async createLeadFromMessage(phone, message) {
    try {
      const { data: existingLeads } = await repository.getLeads({ search: phone });
      const existingLead = (existingLeads || []).find(l => l.phone === phone);

      if (existingLead) {
        await repository.createNote({
          lead_id: existingLead.id,
          note_type: 'WhatsApp',
          content: message,
          created_at: new Date().toISOString()
        });
        return existingLead;
      }

      const newLead = await repository.createLead({
        phone,
        message,
        source: 'whatsapp',
        status: 'new',
        ai_score: this.calculateAIScore(message),
        ai_priority: this.calculatePriority(message),
        created_at: new Date().toISOString()
      });

      await repository.createNote({
        lead_id: newLead.id,
        note_type: 'WhatsApp',
        content: `New lead from WhatsApp: ${message}`,
        created_at: new Date().toISOString()
      });

      return newLead;
    } catch (error) {
      console.error('Error creating lead from WhatsApp:', error);
      throw error;
    }
  }

  async sendAutoReply(to) {
    try {
      const welcomeMessage = 'Thank you for contacting us! We will get back to you shortly.';
      await this.sendTextMessage(to, welcomeMessage);
    } catch (error) {
      console.error('Error sending auto-reply:', error);
    }
  }

  async logMessage(phone, content, direction) {
    try {
      await repository.createNote({
        note_type: 'WhatsApp',
        content: `[WhatsApp ${direction}]: ${content} (Phone: ${phone})`,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

  calculateAIScore(message) {
    let score = 50;
    const text = message.toLowerCase();

    if (text.includes("urgent") || text.includes("immediately") || text.includes("today")) score += 20;
    if (text.includes("budget") || text.includes("cr") || text.includes("lakh") || text.includes("price")) score += 15;
    if (text.includes("buy") || text.includes("purchase") || text.includes("looking for")) score += 15;
    if (text.includes("location") || text.includes("area") || text.includes("city")) score += 10;

    return Math.min(score, 99);
  }

  calculatePriority(message) {
    const score = this.calculateAIScore(message);
    if (score >= 80) return "hot";
    if (score >= 60) return "warm";
    return "cold";
  }

  formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned.startsWith("91") && cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }
    return cleaned;
  }
}

const whatsappBusinessService = new WhatsAppBusinessService();
module.exports = whatsappBusinessService;
