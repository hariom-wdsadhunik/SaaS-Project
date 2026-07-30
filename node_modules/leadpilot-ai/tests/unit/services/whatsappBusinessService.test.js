const whatsappBusinessService = require('../../../services/whatsappBusinessService');
const { config } = require('../../../config');
const demoStore = require('../../../db/demoStore');
const repository = require('../../../db');

describe('WhatsApp Business Service Unit Tests (services/whatsappBusinessService.js)', () => {
  beforeEach(async () => {
    await demoStore.seedData();
    config.whatsapp.accessToken = 'test-whatsapp-access-token';
    config.whatsapp.phoneNumberId = '1234567890';
    config.whatsapp.apiVersion = 'v18.0';

    whatsappBusinessService.accessToken = 'test-whatsapp-access-token';
    whatsappBusinessService.phoneNumberId = '1234567890';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        messages: [{ id: 'wamid.HBgLMTIzNDU2Nzg5MA==' }]
      })
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format Indian phone numbers correctly (+91 / 10-digit)', () => {
    expect(whatsappBusinessService.formatPhoneNumber('9876543210')).toBe('919876543210');
    expect(whatsappBusinessService.formatPhoneNumber('+91 98765 43210')).toBe('919876543210');
  });

  it('should throw error when WhatsApp API is not configured', async () => {
    whatsappBusinessService.accessToken = '';
    expect(whatsappBusinessService.isConfigured()).toBe(false);

    await expect(
      whatsappBusinessService.sendTextMessage('9876543210', 'Test')
    ).rejects.toThrow('WhatsApp Business API not configured');

    await expect(
      whatsappBusinessService.sendTemplateMessage('9876543210', 'tmp')
    ).rejects.toThrow('WhatsApp Business API not configured');

    whatsappBusinessService.accessToken = 'test-whatsapp-access-token';
  });

  it('should send text message via Graph API fetch call', async () => {
    const result = await whatsappBusinessService.sendTextMessage('9876543210', 'Hello from LeadPilot');

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('wamid.HBgLMTIzNDU2Nzg5MA==');
    expect(result.to).toBe('919876543210');
  });

  it('should send template message via Graph API fetch call', async () => {
    const result = await whatsappBusinessService.sendTemplateMessage(
      '9876543210',
      'welcome_template',
      'en',
      []
    );

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('wamid.HBgLMTIzNDU2Nzg5MA==');
  });

  it('should parse inbound text webhook payload and create new lead', async () => {
    const webhookPayload = {
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: 'msg-1',
                    type: 'text',
                    from: '919998887770',
                    text: { body: 'Urgent! Looking for 3BHK flat in Sector 62' }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const result = await whatsappBusinessService.handleWebhookEvent(webhookPayload);

    expect(result.processed).toBe(true);
    expect(result.count).toBe(1);
    expect(result.results[0].from).toBe('919998887770');
  });

  it('should handle existing lead when receiving inbound WhatsApp message', async () => {
    const lead = await repository.createLead({ name: 'Existing Lead', phone: '918887776660', status: 'new' });
    const existingLead = await whatsappBusinessService.createLeadFromMessage(lead.phone, 'Follow up message');

    expect(existingLead.id).toBe(lead.id);
  });

  it('should calculate priority ranges (hot, warm, cold)', () => {
    expect(whatsappBusinessService.calculatePriority('urgent buy 2Cr sector 62')).toBe('hot');
    expect(whatsappBusinessService.calculatePriority('looking for 2BHK flat')).toBe('warm');
    expect(whatsappBusinessService.calculatePriority('hello')).toBe('cold');
  });

  it('should handle API response errors in sendTextMessage and sendTemplateMessage', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: { message: 'OAuth Token Expired' } })
    });

    await expect(whatsappBusinessService.sendTextMessage('9876543210', 'Test')).rejects.toThrow('OAuth Token Expired');
    await expect(whatsappBusinessService.sendTemplateMessage('9876543210', 'tmp')).rejects.toThrow('OAuth Token Expired');
  });

  it('should return processed: false for empty webhook payload', async () => {
    const result = await whatsappBusinessService.handleWebhookEvent({});
    expect(result.processed).toBe(false);
  });

  it('should handle errors gracefully in logMessage and sendAutoReply catch blocks', async () => {
    jest.spyOn(repository, 'createNote').mockRejectedValueOnce(new Error('Note Error'));
    await whatsappBusinessService.logMessage('9876543210', 'content', 'outbound');

    whatsappBusinessService.accessToken = '';
    await whatsappBusinessService.sendAutoReply('9876543210');
    whatsappBusinessService.accessToken = 'test-whatsapp-access-token';
  });
});
