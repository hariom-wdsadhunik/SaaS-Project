const { app, request, getAuthToken, setupTestData } = require('./integration.setup');
const whatsappService = require('../../services/whatsappService');

describe('WhatsApp API Integration Tests (routes/whatsapp.js & routes/webhook.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
    jest.spyOn(whatsappService, 'sendMessage').mockResolvedValue({ messaging_product: 'whatsapp', contacts: [], messages: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should verify Meta webhook challenge token via GET /webhook', async () => {
    const res = await request(app)
      .get('/webhook?hub.mode=subscribe&hub.verify_token=leadpilot_token&hub.challenge=challenge123');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('challenge123');
  });

  it('should process inbound WhatsApp lead payload via POST /webhook', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '919998887770',
                      text: { body: 'Looking for 3BHK in Gurgaon budget 2 Cr' }
                    }
                  ]
                }
              }
            ]
          }
        ]
      });

    expect(res.statusCode).toBe(200);
  });
});
