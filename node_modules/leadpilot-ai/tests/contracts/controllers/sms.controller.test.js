const smsController = require('../../../controllers/smsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('SMS Controller Contract Tests (controllers/smsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('POST /api/sms/send', () => {
    it('should return 400 Bad Request when mandatory fields to or body are missing', async () => {
      req.body = { to: '9998887770' };

      await smsController.sendSms(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'to and body are required' });
    });
  });

  describe('POST /api/sms/send-lead & /send-bulk', () => {
    it('should return 400 Bad Request when leadId is missing', async () => {
      req.body = { body: 'SMS message' };

      await smsController.sendToLead(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'leadId is required' });
    });

    it('should return 400 Bad Request when bulk leadIds array is missing', async () => {
      req.body = {};

      await smsController.sendBulk(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'leadIds array is required' });
    });
  });

  describe('GET /api/sms/status & /logs', () => {
    it('should return Twilio SMS configuration status', async () => {
      await smsController.getStatus(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({ configured: expect.any(Boolean) }));
    });

    it('should fetch SMS logs with pagination metadata', async () => {
      jest.spyOn(repository, 'getSmsLogs').mockResolvedValue([{ id: 'sms-1', status: 'sent' }]);

      await smsController.getLogs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        logs: [{ id: 'sms-1', status: 'sent' }],
        pagination: { total: 1, limit: 50, offset: 0 }
      });
    });
  });
});
