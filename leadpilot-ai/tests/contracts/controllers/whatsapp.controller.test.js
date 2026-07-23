const whatsappController = require('../../../controllers/whatsappController');
const repository = require('../../../db');
const leadScoringService = require('../../../services/leadScoringService');
const emailService = require('../../../services/emailService');
const { createMockContext } = require('./controller.setup');

describe('WhatsApp Controller Contract Tests (controllers/whatsappController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /webhook/whatsapp (verifyWebhook)', () => {
    it('should return 200 OK with challenge token when verify_token matches', () => {
      req.query = {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'leadpilot_token',
        'hub.challenge': 'challenge_code_123'
      };

      whatsappController.verifyWebhook(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBe('challenge_code_123');
    });

    it('should return 403 Forbidden when verify_token is invalid', () => {
      req.query = {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong_token',
        'hub.challenge': 'challenge_code_123'
      };

      whatsappController.verifyWebhook(req, res);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /webhook/whatsapp (handleMessage)', () => {
    it('should parse inbound message, calculate score, save lead, and return 200 OK', async () => {
      req.body = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '919998887770',
                      text: { body: 'Looking for 3BHK in Gurgaon budget 1.5 Cr' }
                    }
                  ]
                }
              }
            ]
          }
        ]
      };

      const mockLead = { id: 'lead-ws-1', phone: '919998887770', ai_score: 85 };
      jest.spyOn(repository, 'createLead').mockResolvedValue(mockLead);
      jest.spyOn(repository, 'getUserById').mockResolvedValue({ id: 'user-1', email: 'admin@leadpilot.ai' });
      jest.spyOn(emailService, 'sendHighPriorityAlert').mockResolvedValue(true);
      jest.spyOn(emailService, 'sendNewLeadNotification').mockResolvedValue(true);

      await whatsappController.handleMessage(req, res);

      expect(res.statusCode).toBe(200);
      expect(repository.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '919998887770',
          source: 'whatsapp'
        })
      );
    });

    it('should handle payload with no messages gracefully and return 200 OK', async () => {
      req.body = {};

      await whatsappController.handleMessage(req, res);

      expect(res.statusCode).toBe(200);
    });
  });
});
