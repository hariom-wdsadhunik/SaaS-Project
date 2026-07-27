const emailService = require('../../../services/emailService');

describe('Email Service Unit Tests (services/emailService.js)', () => {
  beforeEach(() => {
    emailService.transporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-msg-123' })
    };
  });

  it('should send new lead notification email', async () => {
    const lead = { phone: '9998887770', budget: '1 Cr', location: 'Gurgaon', message: 'Hello' };
    const scoreData = {
      totalScore: 85,
      category: 'High Priority',
      priority: 'hot',
      aiInsights: ['Investor lead'],
      estimatedConversion: { probability: '75-90%', timeframe: '1-2 weeks' }
    };

    const success = await emailService.sendNewLeadNotification('agent@example.com', lead, scoreData);

    expect(success).toBe(true);
    expect(emailService.transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'agent@example.com',
        subject: expect.stringContaining('New Lead')
      })
    );
  });

  it('should send follow-up reminder email', async () => {
    const lead = { phone: '9998887770', status: 'new' };
    const success = await emailService.sendFollowUpReminder('agent@example.com', lead, 3);

    expect(success).toBe(true);
    expect(emailService.transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'agent@example.com',
        subject: expect.stringContaining('Follow-up Reminder')
      })
    );
  });

  it('should send daily summary email', async () => {
    const stats = { newLeads: 5, contacted: 3, closed: 1 };
    const success = await emailService.sendDailySummary('agent@example.com', stats);

    expect(success).toBe(true);
  });

  it('should send high priority alert email', async () => {
    const lead = { phone: '9998887770', budget: '5 Cr' };
    const scoreData = { totalScore: 95 };
    const success = await emailService.sendHighPriorityAlert('agent@example.com', lead, scoreData);

    expect(success).toBe(true);
  });

  it('should send team invitation email', async () => {
    const success = await emailService.sendTeamInvitation(
      'invitee@example.com',
      'John',
      'Alpha Team',
      'Admin User',
      'TempPass123'
    );

    expect(success).toBe(true);
  });

  it('should handle SMTP transport error in all notification methods', async () => {
    emailService.transporter.sendMail = jest.fn().mockRejectedValue(new Error('SMTP Transport Error'));

    const lead = { phone: '9998887770' };
    const scoreData = { totalScore: 50, priority: 'cold', aiInsights: [], estimatedConversion: {} };

    expect(await emailService.sendNewLeadNotification('agent@example.com', lead, scoreData)).toBe(false);
    expect(await emailService.sendFollowUpReminder('agent@example.com', lead, 3)).toBe(false);
    expect(await emailService.sendDailySummary('agent@example.com', { newLeads: 0, contacted: 0, closed: 0 })).toBe(false);
    expect(await emailService.sendHighPriorityAlert('agent@example.com', lead, scoreData)).toBe(false);
    expect(await emailService.sendTeamInvitation('agent@example.com', 'Alice', 'Team', 'Admin', '123')).toBe(false);
  });

  it('should compile HTML templates directly with all branch conditions', () => {
    const lead = { phone: '9998887770', budget: '1 Cr', location: 'Gurgaon', message: 'Hello' };
    const scoreData = {
      totalScore: 85,
      category: 'High Priority',
      priority: 'hot',
      aiInsights: ['Insight 1'],
      estimatedConversion: { probability: '80%', timeframe: '1 week' }
    };

    const html1 = emailService.getNewLeadTemplate(lead, scoreData);
    expect(html1).toContain('New Lead Captured');

    const html2 = emailService.getFollowUpTemplate(lead, 5);
    expect(html2).toContain('5 days');

    const html3 = emailService.getDailySummaryTemplate({ newLeads: 10, contacted: 5, closed: 2 });
    expect(html3).toContain('10');

    const html4 = emailService.getHighPriorityTemplate(lead, scoreData);
    expect(html4).toContain('HOT LEAD ALERT');

    const html5 = emailService.getTeamInvitationTemplate('Alice', 'Team A', 'Bob', 'Pass123', 'http://localhost');
    expect(html5).toContain('Alice');
  });
});
