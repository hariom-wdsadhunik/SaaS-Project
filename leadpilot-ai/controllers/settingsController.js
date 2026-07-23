const repository = require('../db');

exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await repository.getSettings(userId);
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

exports.setSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const userId = req.user.id;

    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    const saved = await repository.saveSettings(userId, { [key]: value });
    res.json({ message: 'Setting saved', setting: saved });
  } catch (error) {
    console.error('Set setting error:', error);
    res.status(500).json({ error: 'Failed to save setting' });
  }
};

exports.setMultipleSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user.id;

    if (!settings || (typeof settings !== 'object' && !Array.isArray(settings))) {
      return res.status(400).json({ error: 'Settings required' });
    }

    const newSettings = Array.isArray(settings)
      ? settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
      : settings;

    const saved = await repository.saveSettings(userId, newSettings);
    res.json({ message: 'Settings saved', count: Object.keys(newSettings).length });
  } catch (error) {
    console.error('Set multiple settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const userId = req.user.id;

    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    res.json({ message: 'Setting deleted' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};

exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await repository.getSettings(userId);
    res.json({ settings });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
};

exports.setNotificationSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user.id;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    const saved = await repository.saveSettings(userId, settings);
    res.json({ message: 'Notification settings saved', count: Object.keys(settings).length });
  } catch (error) {
    console.error('Set notification settings error:', error);
    res.status(500).json({ error: 'Failed to save notification settings' });
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    res.json({
      integrations: {
        whatsapp: { configured: false, connected: false },
        email: { configured: false, provider: null },
        sms: { configured: false, provider: null },
        calendar: { configured: false, provider: null }
      }
    });
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
};
