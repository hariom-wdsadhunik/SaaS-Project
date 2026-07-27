const teamController = require('../../../controllers/teamController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Team Controller Contract Tests (controllers/teamController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('POST & GET /api/team', () => {
    it('should return 201 Created on valid team creation', async () => {
      req.body = { name: 'Alpha Real Estate Team', description: 'Top performers' };

      await teamController.createTeam(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({
        message: 'Team created successfully',
        team: expect.objectContaining({ name: 'Alpha Real Estate Team' })
      }));
    });

    it('should return 400 Bad Request when team name is missing', async () => {
      req.body = { description: 'Missing name' };

      await teamController.createTeam(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Team name is required' });
    });

    it('should return team details and member stats', async () => {
      await teamController.getTeam(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        team: expect.any(Object),
        members: expect.any(Array),
        stats: expect.any(Object)
      }));
    });
  });

  describe('Team Member Operations (invite, remove, assign lead)', () => {
    it('should invite member and return 201 Created', async () => {
      req.body = { email: 'agent@leadpilot.ai', name: 'Agent Smith', role: 'agent' };

      await teamController.inviteMember(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Invitation sent successfully' }));
    });

    it('should assign lead to team member', async () => {
      req.params = { leadId: 'lead-1' };
      req.body = { userId: 'user-2' };
      const updatedLead = { id: 'lead-1', assigned_to: 'user-2' };

      jest.spyOn(repository, 'updateLead').mockResolvedValue(updatedLead);

      await teamController.assignLead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Lead assigned successfully', lead: updatedLead });
    });
  });
});
