const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter (configure with your email provider)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.fromEmail = process.env.FROM_EMAIL || 'leads@leadpilot.ai';
  }

  /**
   * Send new lead notification
   */
  async sendNewLeadNotification(userEmail, lead, scoreData) {
    const mailOptions = {
      from: `"LeadPilot AI" <${this.fromEmail}>`,
      to: userEmail,
      subject: `🎯 New Lead: ${lead.budget || 'Budget N/A'} - ${lead.location || 'Location N/A'}`,
      html: this.getNewLeadTemplate(lead, scoreData)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`New lead notification sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  /**
   * Send follow-up reminder
   */
  async sendFollowUpReminder(userEmail, lead, daysSinceContact) {
    const mailOptions = {
      from: `"LeadPilot AI" <${this.fromEmail}>`,
      to: userEmail,
      subject: `⏰ Follow-up Reminder: Lead from ${lead.phone}`,
      html: this.getFollowUpTemplate(lead, daysSinceContact)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Follow-up reminder sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  /**
   * Send daily summary
   */
  async sendDailySummary(userEmail, stats) {
    const mailOptions = {
      from: `"LeadPilot AI" <${this.fromEmail}>`,
      to: userEmail,
      subject: `📊 Your Daily Lead Summary - ${new Date().toLocaleDateString()}`,
      html: this.getDailySummaryTemplate(stats)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Daily summary sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  /**
   * Send high priority lead alert
   */
  async sendHighPriorityAlert(userEmail, lead, scoreData) {
    const mailOptions = {
      from: `"LeadPilot AI" <${this.fromEmail}>`,
      to: userEmail,
      subject: `🔥 HOT LEAD ALERT: Score ${scoreData.totalScore}/100`,
      html: this.getHighPriorityTemplate(lead, scoreData)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`High priority alert sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  /**
   * Send team invitation email
   */
  async sendTeamInvitation(inviteeEmail, inviteeName, teamName, inviterName, tempPassword) {
    const loginUrl = process.env.APP_URL || 'http://localhost:80';
    
    const mailOptions = {
      from: `"LeadPilot AI" <${this.fromEmail}>`,
      to: inviteeEmail,
      subject: `You've been invited to join ${teamName} on LeadPilot AI`,
      html: this.getTeamInvitationTemplate(inviteeName, teamName, inviterName, tempPassword, loginUrl)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Team invitation sent to ${inviteeEmail}`);
      return true;
    } catch (error) {
      console.error('Team invitation email failed:', error);
      return false;
    }
  }

  // Email Templates
  getNewLeadTemplate(lead, scoreData) {
    const priorityEmoji = scoreData.priority === 'hot' ? '🔥' : scoreData.priority === 'warm' ? '⚡' : '📋';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">${priorityEmoji} New Lead Captured!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">AI Score: <strong>${scoreData.totalScore}/100</strong> - ${scoreData.category}</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #111827; margin-top: 0;">Lead Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; width: 120px;">Phone:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${lead.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Budget:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${lead.budget || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Location:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${lead.location || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; vertical-align: top;">Message:</td>
                <td style="padding: 10px 0; color: #374151;">${lead.message || 'No message'}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="color: #111827; margin-top: 0;">AI Insights</h3>
            <ul style="color: #374151; padding-left: 20px;">
              ${scoreData.aiInsights.map(insight => `<li style="margin-bottom: 8px;">${insight}</li>`).join('')}
            </ul>
            <p style="margin-top: 15px; padding: 12px; background: #eff6ff; border-radius: 8px; color: #1e40af;">
              <strong>Estimated Conversion:</strong> ${scoreData.estimatedConversion.probability} within ${scoreData.estimatedConversion.timeframe}
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.APP_URL || 'http://localhost:80'}/dashboard" 
               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              View in Dashboard
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>You're receiving this because you have notifications enabled for new leads.</p>
          <p>© 2024 LeadPilot AI. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  getFollowUpTemplate(lead, daysSinceContact) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f59e0b; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">⏰ Follow-up Reminder</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px;">
              You haven't contacted this lead in <strong>${daysSinceContact} days</strong>:
            </p>
            
            <div style="margin: 20px 0; padding: 16px; background: #fef3c7; border-radius: 8px;">
              <p style="margin: 0; color: #92400e;"><strong>Phone:</strong> ${lead.phone}</p>
              <p style="margin: 8px 0 0 0; color: #92400e;"><strong>Status:</strong> ${lead.status}</p>
            </div>
            
            <a href="${process.env.APP_URL || 'http://localhost:80'}/dashboard" 
               style="display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Contact Now
            </a>
          </div>
        </div>
      </div>
    `;
  }

  getDailySummaryTemplate(stats) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">📊 Daily Lead Summary</h1>
          <p style="margin: 10px 0 0 0;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
            <div style="text-align: center; padding: 20px; background: white; border-radius: 12px; flex: 1; margin: 0 10px;">
              <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${stats.newLeads}</div>
              <div style="color: #6b7280; font-size: 14px;">New Leads</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border-radius: 12px; flex: 1; margin: 0 10px;">
              <div style="font-size: 32px; font-weight: bold; color: #8b5cf6;">${stats.contacted}</div>
              <div style="color: #6b7280; font-size: 14px;">Contacted</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border-radius: 12px; flex: 1; margin: 0 10px;">
              <div style="font-size: 32px; font-weight: bold; color: #10b981;">${stats.closed}</div>
              <div style="color: #6b7280; font-size: 14px;">Closed</div>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.APP_URL || 'http://localhost:80'}/dashboard" 
               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              View Full Dashboard
            </a>
          </div>
        </div>
      </div>
    `;
  }

  getHighPriorityTemplate(lead, scoreData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🔥 HOT LEAD ALERT</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Score: ${scoreData.totalScore}/100 - Contact Immediately!</p>
        </div>
        
        <div style="padding: 30px; background: #fef2f2;">
          <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; margin-top: 0;">Lead Details</h2>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Budget:</strong> ${lead.budget || 'Not specified'}</p>
            <p><strong>Location:</strong> ${lead.location || 'Not specified'}</p>
            <p><strong>Message:</strong> ${lead.message || 'No message'}</p>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="${process.env.APP_URL || 'http://localhost:80'}/dashboard" 
                 style="display: inline-block; padding: 16px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Contact This Lead Now
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getTeamInvitationTemplate(inviteeName, teamName, inviterName, tempPassword, loginUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">You've Been Invited!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Join ${teamName} on LeadPilot AI</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; margin-top: 0;">
              Hi <strong>${inviteeName}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px;">
              <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on LeadPilot AI, 
              an AI-powered Real Estate CRM.
            </p>
            <p style="color: #374151; font-size: 16px;">
              Your temporary password is: <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${tempPassword}</code>
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
              Please log in and change your password immediately.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${loginUrl}/login.html" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Get Started
              </a>
            </div>
          </div>

          <div style="background: #fffbeb; border-radius: 12px; padding: 16px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Security Tip:</strong> For your account security, please change your password after your first login.
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>© 2024 LeadPilot AI. All rights reserved.</p>
        </div>
      </div>
    `;
  }
}

module.exports = new EmailService();
