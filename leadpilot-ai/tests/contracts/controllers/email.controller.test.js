const emailController = require('../../../controllers/emailController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Email Controller Contract Tests (controllers/emailController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('POST /api/email/send', () => {
    it('should return 400 Bad Request when mandatory fields to, subject, or body are missing', async () => {
      req.body = { to: 'client@example.com' };

      await emailController.sendEmail(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'to, subject, and body are required' });
    });
  });

  describe('POST /api/email/send-lead', () => {
    it('should return 400 Bad Request when leadId is missing', async () => {
      req.body = { subject: 'Hi' };

      await emailController.sendToLead(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'leadId is required' });
    });

    it('should send email to lead and return 200 OK when email is configured', async () => {
      req.body = { leadId: 'lead-1', subject: 'Property Details', body: 'Hello' };
      const lead = { id: 'lead-1', email: 'lead@example.com', name: 'Lead Name' };

      jest.spyOn(repository, 'getLeadById').mockResolvedValue(lead);
      jest.spyOn(repository, 'createEmailLog').mockResolvedValue({});
      jest.spyOn(repository, 'createNote').mockResolvedValue({});
      jest.spyOn(emailController, 'parseEmailConfig').mockReturnValue({ configured: true, service: 'SMTP' });
      jest.spyOn(emailController.transporter, 'sendMail').mockResolvedValue({ messageId: 'msg-101' });

      await emailController.sendToLead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Email sent successfully', success: true }));
    });
  });

  describe('POST /api/email/send-bulk', () => {
    it('should return 400 Bad Request when leadIds array is missing or empty', async () => {
      req.body = { leadIds: [] };

      await emailController.sendBulk(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'leadIds array is required' });
    });
  });

  describe('GET /api/email/status & /logs', () => {
    it('should return email service status', async () => {
      await emailController.getStatus(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({ configured: expect.any(Boolean) }));
    });

    it('should fetch email logs with pagination metadata', async () => {
      jest.spyOn(repository, 'getEmailLogs').mockResolvedValue([{ id: 'log-1', status: 'sent' }]);

      await emailController.getEmailLogs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        logs: [{ id: 'log-1', status: 'sent' }],
        pagination: { total: 1, limit: 50, offset: 0 }
      });
    });
  });
});
