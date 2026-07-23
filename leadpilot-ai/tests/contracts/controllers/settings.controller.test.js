const settingsController = require('../../../controllers/settingsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Settings Controller Contract Tests (controllers/settingsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET & POST /api/settings', () => {
    it('should fetch user settings', async () => {
      jest.spyOn(repository, 'getSettings').mockResolvedValue({ theme: 'dark' });

      await settingsController.getSettings(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ settings: { theme: 'dark' } });
    });

    it('should set single setting key-value pair', async () => {
      req.body = { key: 'theme', value: 'dark' };
      jest.spyOn(repository, 'saveSettings').mockResolvedValue({ theme: 'dark' });

      await settingsController.setSetting(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Setting saved', setting: { theme: 'dark' } });
    });

    it('should return 400 Bad Request when setting key is missing', async () => {
      req.body = { value: 'dark' };

      await settingsController.setSetting(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Key is required' });
    });

    it('should set multiple settings in bulk', async () => {
      req.body = { settings: { theme: 'dark', notifications: true } };
      jest.spyOn(repository, 'saveSettings').mockResolvedValue(req.body.settings);

      await settingsController.setMultipleSettings(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Settings saved', count: 2 });
    });

    it('should return system integration connection status', async () => {
      await settingsController.getIntegrations(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        integrations: {
          whatsapp: { configured: false, connected: false },
          email: { configured: false, provider: null },
          sms: { configured: false, provider: null },
          calendar: { configured: false, provider: null }
        }
      });
    });
  });
});
