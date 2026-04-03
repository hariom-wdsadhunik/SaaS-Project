const { supabase } = require("../db/supabase");
const { config } = require("../config");

class SmsController {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.apiEndpoint = "https://api.twilio.com/2010-04-01";
  }

  isConfigured() {
    return !!(this.accountSid && this.authToken && this.fromNumber);
  }

  formatPhoneNumber(phone) {
    let formatted = phone.replace(/\D/g, "");
    if (!formatted.startsWith("1") && formatted.length === 10) {
      formatted = "91" + formatted;
    }
    if (!formatted.startsWith("+")) {
      formatted = "+" + formatted;
    }
    return formatted;
  }

  async sendSms({ to, body }) {
    if (!this.isConfigured()) {
      throw new Error("Twilio SMS not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.");
    }

    const formattedNumber = this.formatPhoneNumber(to);
    const url = `${this.apiEndpoint}/Accounts/${this.accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append("To", formattedNumber);
    formData.append("From", this.fromNumber);
    formData.append("Body", body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send SMS");
      }

      return {
        success: true,
        messageId: data.sid,
        status: data.status,
        to: data.to,
        dateCreated: data.date_created,
      };
    } catch (error) {
      console.error("SMS send error:", error);
      throw error;
    }
  }

  async sendToLead({ leadId, body, templateId, variables = {} }) {
    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .select("id, phone, name")
        .eq("id", leadId)
        .single();

      if (error || !lead) {
        throw new Error("Lead not found");
      }

      if (!lead.phone) {
        throw new Error("Lead has no phone number");
      }

      let messageBody = body;

      if (templateId) {
        const { data: template } = await supabase
          .from("sms_templates")
          .select("*")
          .eq("id", templateId)
          .single();

        if (template) {
          messageBody = template.body;
        }
      }

      const mergeVars = {
        lead_name: lead.name || "Customer",
        ...variables,
      };

      Object.entries(mergeVars).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        messageBody = messageBody.replace(regex, value || "");
      });

      const result = await this.sendSms({ to: lead.phone, body: messageBody });

      await supabase.from("sms_logs").insert([
        {
          lead_id: leadId,
          user_id: variables.userId,
          phone: lead.phone,
          message: messageBody,
          direction: "outbound",
          status: "sent",
          twilio_sid: result.messageId,
          created_at: new Date().toISOString(),
        },
      ]);

      return { success: true, lead, ...result };
    } catch (error) {
      console.error("Send SMS to lead error:", error);

      await supabase.from("sms_logs").insert([
        {
          lead_id: leadId,
          user_id: variables.userId,
          phone: variables.phone || "",
          message: body,
          direction: "outbound",
          status: "failed",
          error_message: error.message,
          created_at: new Date().toISOString(),
        },
      ]);

      throw error;
    }
  }

  async sendBulk({ leadIds, body, templateId }) {
    const results = { success: [], failed: [] };

    for (const leadId of leadIds) {
      try {
        const result = await this.sendToLead({ leadId, body, templateId });
        results.success.push({ leadId, ...result });
      } catch (error) {
        results.failed.push({ leadId, error: error.message });
      }
    }

    return results;
  }

  getStatus() {
    return {
      configured: this.isConfigured(),
      fromNumber: this.fromNumber ? "***" + this.fromNumber.slice(-4) : null,
    };
  }
}

const smsController = new SmsController();

exports.sendSms = async (req, res) => {
  try {
    const { to, body } = req.body;

    if (!to || !body) {
      return res.status(400).json({ error: "to and body are required" });
    }

    const result = await smsController.sendSms({ to, body });
    res.json({ message: "SMS sent successfully", ...result });
  } catch (error) {
    console.error("Send SMS error:", error);
    res.status(500).json({ error: error.message || "Failed to send SMS" });
  }
};

exports.sendToLead = async (req, res) => {
  try {
    const { leadId, body, templateId } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    const result = await smsController.sendToLead({
      leadId,
      body,
      templateId,
      variables: { userId: req.user.id },
    });

    res.json({ message: "SMS sent successfully", ...result });
  } catch (error) {
    console.error("Send SMS to lead error:", error);
    res.status(500).json({ error: error.message || "Failed to send SMS" });
  }
};

exports.sendBulk = async (req, res) => {
  try {
    const { leadIds, body, templateId } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ error: "leadIds array is required" });
    }

    const results = await smsController.sendBulk({ leadIds, body, templateId });

    res.json({
      message: `Sent to ${results.success.length} leads, ${results.failed.length} failed`,
      results,
    });
  } catch (error) {
    console.error("Send bulk SMS error:", error);
    res.status(500).json({ error: error.message || "Failed to send bulk SMS" });
  }
};

exports.getStatus = async (req, res) => {
  res.json(smsController.getStatus());
};

exports.getLogs = async (req, res) => {
  try {
    const { limit = 50, offset = 0, leadId, direction } = req.query;

    let query = supabase
      .from("sms_logs")
      .select("*, leads(phone, name)")
      .order("created_at", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (leadId) {
      query = query.eq("lead_id", leadId);
    }

    if (direction) {
      query = query.eq("direction", direction);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      logs: data || [],
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Get SMS logs error:", error);
    res.status(500).json({ error: "Failed to fetch SMS logs" });
  }
};

module.exports = smsController;
