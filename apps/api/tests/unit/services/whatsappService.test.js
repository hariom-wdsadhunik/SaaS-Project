const axios = require('axios');
const whatsappService = require('../../../services/whatsappService');

jest.mock('axios');

describe('WhatsApp Legacy Service Unit Tests (services/whatsappService.js)', () => {
  it('should call Graph API messages endpoint via axios', async () => {
    axios.post.mockResolvedValueOnce({ data: { messaging_product: 'whatsapp', contacts: [{ input: '919998887770' }] } });

    await whatsappService.sendMessage('919998887770', 'Hello from LeadPilot AI');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/messages'),
      expect.objectContaining({
        messaging_product: 'whatsapp',
        to: '919998887770',
        text: { body: 'Hello from LeadPilot AI' }
      }),
      expect.any(Object)
    );
  });
});
