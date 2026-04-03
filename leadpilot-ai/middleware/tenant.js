const { supabase } = require('../db/supabase');

const requireTeam = async (req, res, next) => {
  if (!req.user?.team_id) {
    return res.status(403).json({ 
      error: 'Team required',
      message: 'You must be part of a team to access this resource',
      action: 'create_or_join_team'
    });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin required',
      message: 'Only team admins can perform this action'
    });
  }
  next();
};

const loadTenantContext = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, role, team_id')
      .eq('id', req.user.id)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.tenant = {
      id: user.team_id,
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      userName: user.name
    };

    next();
  } catch (error) {
    console.error('Tenant context error:', error);
    res.status(500).json({ error: 'Failed to load tenant context' });
  }
};

const addTenantFilter = (tableName, teamField = 'team_id') => {
  return (req, res, next) => {
    if (req.tenant?.id) {
      req.tenantFilter = { [teamField]: req.tenant.id };
    }
    next();
  };
};

const validateTeamAccess = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    
    if (teamId && teamId !== req.user?.team_id) {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You can only access your own team'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Team access validation error:', error);
    res.status(500).json({ error: 'Failed to validate team access' });
  }
};

const logActivity = async (action, description, metadata = {}) => {
  return async (req, res, next) => {
    if (!req.user?.id || !req.user?.team_id) {
      return next();
    }

    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await supabase.from('activity_logs').insert([{
            user_id: req.user.id,
            team_id: req.user.team_id,
            action,
            description,
            metadata: { ...metadata, method: req.method, path: req.path }
          }]);
        } catch (err) {
          console.error('Activity log error:', err);
        }
      }
    });

    next();
  };
};

module.exports = {
  requireTeam,
  requireAdmin,
  loadTenantContext,
  addTenantFilter,
  validateTeamAccess,
  logActivity
};
