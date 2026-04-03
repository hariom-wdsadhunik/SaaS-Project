const { supabase } = require('../db/supabase');

exports.getSettings = async (req, res) => {
  try {
    const { key } = req.query;
    const userId = req.user.id;
    const teamId = req.user.team_id;

    if (key) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .eq('key', key)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return res.json({ key, value: data?.value || null });
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const settings = {};
    data?.forEach(s => { settings[s.key] = s.value; });

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
    const teamId = req.user.team_id;

    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    const { data, error } = await supabase
      .from('settings')
      .upsert({
        user_id: userId,
        team_id: teamId,
        key,
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,team_id,key'
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Setting saved', setting: data });
  } catch (error) {
    console.error('Set setting error:', error);
    res.status(500).json({ error: 'Failed to save setting' });
  }
};

exports.setMultipleSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user.id;
    const teamId = req.user.team_id;

    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: 'Settings must be an array' });
    }

    const settingsToUpsert = settings.map(s => ({
      user_id: userId,
      team_id: teamId,
      key: s.key,
      value: s.value,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('settings')
      .upsert(settingsToUpsert, {
        onConflict: 'user_id,team_id,key'
      })
      .select();

    if (error) throw error;

    res.json({ message: 'Settings saved', count: data?.length || 0 });
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

    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('user_id', userId)
      .eq('key', key);

    if (error) throw error;

    res.json({ message: 'Setting deleted' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};

exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const defaultSettings = {
      emailNotifications: true,
      newLeadAlert: true,
      followUpReminder: true,
      dailySummary: true,
      highPriorityAlert: true,
      taskReminders: true,
      appointmentReminders: true,
      weeklyReport: false
    };

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .like('key', 'notification_%');

    if (error) throw error;

    const settings = { ...defaultSettings };
    data?.forEach(s => {
      const shortKey = s.key.replace('notification_', '');
      settings[shortKey] = s.value;
    });

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

    const settingsToUpsert = Object.entries(settings).map(([key, value]) => ({
      user_id: userId,
      key: `notification_${key}`,
      value,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('settings')
      .upsert(settingsToUpsert, {
        onConflict: 'user_id,team_id,key'
      })
      .select();

    if (error) throw error;

    res.json({ message: 'Notification settings saved', count: data?.length || 0 });
  } catch (error) {
    console.error('Set notification settings error:', error);
    res.status(500).json({ error: 'Failed to save notification settings' });
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const integrations = {
      whatsapp: { configured: false, connected: false },
      email: { configured: false, provider: null },
      sms: { configured: false, provider: null },
      calendar: { configured: false, provider: null }
    };

    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('user_id', userId)
      .or('key.like.%whatsapp%,key.like.%email%,key.like.%sms%,key.like.%calendar%');

    if (error) throw error;

    data?.forEach(s => {
      if (s.key.includes('whatsapp')) integrations.whatsapp.configured = true;
      if (s.key.includes('email')) integrations.email.configured = true;
      if (s.key.includes('sms')) integrations.sms.configured = true;
      if (s.key.includes('calendar')) integrations.calendar.configured = true;
    });

    res.json({ integrations });
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
};
