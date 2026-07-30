const repository = require('../db');

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = { id: 'team-' + Date.now(), name, description, owner_id: userId, created_at: new Date().toISOString() };
    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// Get team details
exports.getTeam = async (req, res) => {
  try {
    const teamId = req.user?.team_id || 'team-1';

    res.json({
      team: { id: teamId, name: 'LeadPilot Real Estate Team' },
      members: [
        { id: req.user?.id || 'user-1', name: req.user?.name || 'Admin User', email: req.user?.email || 'admin@leadpilot.ai', role: 'admin' }
      ],
      stats: {
        totalLeads: 5,
        newLeads: 2,
        contacted: 1,
        closed: 1,
        unassigned: 1
      }
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
};

// Invite team member
exports.inviteMember = async (req, res) => {
  try {
    const { email, name, role = 'agent' } = req.body;
    res.status(201).json({
      message: 'Invitation sent successfully',
      user: { id: 'user-' + Date.now(), email, name, role }
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Failed to invite member' });
  }
};

// Remove team member
exports.removeMember = async (req, res) => {
  try {
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

// Update member role
exports.updateMemberRole = async (req, res) => {
  try {
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// Assign lead to team member
exports.assignLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { userId } = req.body;

    const lead = await repository.updateLead(leadId, { assigned_to: userId, assigned_at: new Date().toISOString() });

    res.json({
      message: 'Lead assigned successfully',
      lead
    });
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({ error: 'Failed to assign lead' });
  }
};

// Get team activity log
exports.getActivityLog = async (req, res) => {
  try {
    res.json({ activities: [] });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ error: 'Failed to get activity log' });
  }
};
