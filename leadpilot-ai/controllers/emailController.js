const nodemailer = require("nodemailer");
const repository = require("../db");
const { config } = require("../config");

class EmailController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.fromEmail = process.env.FROM_EMAIL || "noreply@leadpilot.ai";
    this.fromName = "LeadPilot AI";
  }

  replaceVariables(template, variables) {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, value || "");
    });
    return result;
  }

  parseEmailConfig() {
    if (config.email?.service === "sendgrid" && config.email?.apiKey) {
      return { service: "SendGrid", configured: true };
    }
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      return { service: "SMTP", configured: true };
    }
    return { service: "None", configured: false };
  }

  async sendEmail({ to, subject, html, text, cc, bcc }) {
    const emailConfig = this.parseEmailConfig();
    if (!emailConfig.configured) {
      throw new Error("Email service not configured. Please set SMTP credentials.");
    }

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject,
      html,
      text,
      cc,
      bcc,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Email send error:", error);
      throw error;
    }
  }

  async sendToLead({ leadId, subject, body, templateId, variables = {} }) {
    try {
      const lead = await repository.getLeadById(leadId);

      if (!lead) {
        throw new Error("Lead not found");
      }

      if (!lead.email) {
        throw new Error("Lead has no email address");
      }

      let emailSubject = subject;
      let emailBody = body;

      if (templateId) {
        const template = await repository.getEmailTemplateById(templateId);
        if (template) {
          emailSubject = template.subject;
          emailBody = template.body;
        }
      }

      const mergeVars = {
        lead_name: lead.name || "Customer",
        lead_phone: lead.phone || "",
        lead_email: lead.email || "",
        lead_budget: lead.budget || "",
        lead_location: lead.location || "",
        lead_status: lead.status || "",
        ...variables,
      };

      emailSubject = this.replaceVariables(emailSubject, mergeVars);
      emailBody = this.replaceVariables(emailBody, mergeVars);

      const result = await this.sendEmail({
        to: lead.email,
        subject: emailSubject,
        html: emailBody,
      });

      await repository.createEmailLog({
        user_id: variables.userId,
        lead_id: leadId,
        email_type: templateId ? "template" : "custom",
        status: "sent",
        created_at: new Date().toISOString(),
      });

      await repository.createNote({
        lead_id: leadId,
        note_type: "Email",
        content: `Email sent: ${emailSubject}`,
        created_by: variables.userId,
        created_at: new Date().toISOString(),
      });

      return { success: true, lead, ...result };
    } catch (error) {
      console.error("Send to lead error:", error);

      await repository.createEmailLog({
        user_id: variables.userId,
        lead_id: leadId,
        email_type: "custom",
        status: "failed",
        error_message: error.message,
        created_at: new Date().toISOString(),
      });

      throw error;
    }
  }

  async sendBulk({ leadIds, subject, body, templateId, variables = {} }) {
    const results = { success: [], failed: [] };

    for (const leadId of leadIds) {
      try {
        const result = await this.sendToLead({
          leadId,
          subject,
          body,
          templateId,
          variables,
        });
        results.success.push({ leadId, ...result });
      } catch (error) {
        results.failed.push({ leadId, error: error.message });
      }
    }

    return results;
  }

  async getEmailStatus() {
    const emailConfig = this.parseEmailConfig();
    return {
      configured: emailConfig.configured,
      service: emailConfig.service,
      fromEmail: this.fromEmail,
    };
  }
}

const emailController = new EmailController();

const sendEmail = async (req, res) => {
  try {
    const { to, subject, body, cc, bcc } = req.body || {};

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "to, subject, and body are required" });
    }

    const result = await emailController.sendEmail({ to, subject, html: body, cc, bcc });
    res.json({ message: "Email sent successfully", ...result });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
};

const sendToLead = async (req, res) => {
  if (!res && req && req.leadId) {
    return emailController.sendToLead(req);
  }
  try {
    const { leadId, subject, body, templateId, variables = {} } = req.body || {};

    if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    if (req.user?.id) variables.userId = req.user.id;

    const result = await emailController.sendToLead({ leadId, subject, body, templateId, variables });
    res.json({ message: "Email sent successfully", ...result });
  } catch (error) {
    console.error("Send to lead error:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
};

const sendBulk = async (req, res) => {
  if (!res && req && req.leadIds) {
    return emailController.sendBulk(req);
  }
  try {
    const { leadIds, subject, body, templateId } = req.body || {};

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ error: "leadIds array is required" });
    }

    const results = await emailController.sendBulk({
      leadIds,
      subject,
      body,
      templateId,
      variables: { userId: req.user?.id },
    });

    res.json({
      message: `Sent to ${results.success.length} leads, ${results.failed.length} failed`,
      results,
    });
  } catch (error) {
    console.error("Send bulk email error:", error);
    res.status(500).json({ error: error.message || "Failed to send bulk email" });
  }
};

const getStatus = async (req, res) => {
  try {
    const status = await emailController.getEmailStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to get email status" });
  }
};

const getEmailLogs = async (req, res) => {
  try {
    const { leadId } = req.query || {};
    const logs = await repository.getEmailLogs({ leadId });

    res.json({
      logs: logs || [],
      pagination: {
        total: (logs || []).length,
        limit: 50,
        offset: 0,
      },
    });
  } catch (error) {
    console.error("Get email logs error:", error);
    res.status(500).json({ error: "Failed to fetch email logs" });
  }
};

module.exports = {
  sendEmail,
  sendToLead,
  sendBulk,
  getStatus,
  getEmailLogs,
  parseEmailConfig: emailController.parseEmailConfig.bind(emailController),
  transporter: emailController.transporter,
  instance: emailController
};

