const supabase = require('../db/supabase');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert([{
        name,
        description,
        owner_id: userId,
        created_at: new Date()
      }])
      .select()
      .single();

    if (teamError) throw teamError;

    // Update user with team_id and make them admin
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        team_id: team.id,
        role: 'admin'
      })
      .eq('id', userId);

    if (userError) throw userError;

    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// Get team details
exports.getTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const teamId = req.user.team_id;

    if (!teamId) {
      return res.status(404).json({ error: 'You are not part of any team' });
    }

    // Get team info
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;

    // Get team members
    const { data: members, error: membersError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at, last_login')
      .eq('team_id', teamId);

    if (membersError) throw membersError;

    // Get team stats
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('status, assigned_to')
      .eq('team_id', teamId);

    const stats = {
      totalLeads: leads?.length || 0,
      newLeads: leads?.filter(l => l.status === 'new').length || 0,
      contacted: leads?.filter(l => l.status === 'contacted').length || 0,
      closed: leads?.filter(l => l.status === 'closed').length || 0,
      unassigned: leads?.filter(l => !l.assigned_to).length || 0
    };

    res.json({
      team,
      members,
      stats
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
    const teamId = req.user.team_id;

    if (!teamId) {
      return res.status(400).json({ error: 'You must be part of a team to invite members' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite members' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      if (existingUser.team_id) {
        return res.status(409).json({ error: 'User is already part of a team' });
      }

      // Add existing user to team
      const { error } = await supabase
        .from('users')
        .update({ team_id: teamId, role })
        .eq('id', existingUser.id);

      if (error) throw error;

      return res.json({ message: 'User added to team successfully' });
    }

    // Create invitation
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        email,
        name,
        password: hashedPassword,
        role,
        team_id: teamId,
        created_at: new Date()
      }])
      .select()
      .single();

    if (createError) throw createError;

    // TODO: Send invitation email with temp password

    res.status(201).json({
      message: 'Invitation sent successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Failed to invite member' });
  }
};

// Remove team member
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const teamId = req.user.team_id;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can remove members' });
    }

    // Cannot remove yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot remove yourself from the team' });
    }

    // Remove user from team
    const { error } = await supabase
      .from('users')
      .update({ team_id: null, role: 'agent' })
      .eq('id', userId)
      .eq('team_id', teamId);

    if (error) throw error;

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

// Update member role
exports.updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const teamId = req.user.team_id;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update roles' });
    }

    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .eq('team_id', teamId);

    if (error) throw error;

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
    const teamId = req.user.team_id;

    if (!teamId) {
      return res.status(400).json({ error: 'You must be part of a team to assign leads' });
    }

    // Verify user is in the same team
    const { data: member } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('team_id', teamId)
      .single();

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Update lead assignment
    const { data: lead, error } = await supabase
      .from('leads')
      .update({ 
        assigned_to: userId,
        assigned_at: new Date()
      })
      .eq('id', leadId)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;

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
    const teamId = req.user.team_id;

    if (!teamId) {
      return res.status(400).json({ error: 'You must be part of a team' });
    }

    const { data: activities, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ activities });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ error: 'Failed to get activity log' });
  }
};
