const {
  requireTeam,
  requireAdmin,
  loadTenantContext,
  addTenantFilter,
  validateTeamAccess,
  logActivity
} = require('../../../middleware/tenant');
const demoStore = require('../../../db/demoStore');
const repository = require('../../../db');

describe('Tenant & RBAC Middleware Unit Tests (middleware/tenant.js)', () => {
  let req, res, next;

  beforeEach(async () => {
    await demoStore.seedData();
    req = { user: {}, params: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      on: jest.fn()
    };
    next = jest.fn();
  });

  describe('requireTeam', () => {
    it('should allow user with team_id to proceed', () => {
      req.user = { team_id: 'team-1' };
      requireTeam(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 when user has no team_id', () => {
      req.user = {};
      requireTeam(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Team required' })
      );
    });
  });

  describe('requireAdmin', () => {
    it('should allow admin user to proceed', () => {
      req.user = { role: 'admin' };
      requireAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 for non-admin user', () => {
      req.user = { role: 'agent' };
      requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Admin required' })
      );
    });
  });

  describe('loadTenantContext', () => {
    it('should return 401 when req.user is missing', async () => {
      req.user = null;
      await loadTenantContext(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should load tenant context for valid user ID', async () => {
      req.user = { id: 'user-1' };
      await loadTenantContext(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.tenant).toBeDefined();
      expect(req.tenant.id).toBe('team-1');
    });

    it('should return 401 when user is not found in repository', async () => {
      req.user = { id: 'non-existent-user-id' };
      await loadTenantContext(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle repository errors in loadTenantContext (500)', async () => {
      req.user = { id: 'user-1' };
      jest.spyOn(repository, 'getUserById').mockRejectedValueOnce(new Error('DB Error'));
      await loadTenantContext(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to load tenant context' });
    });
  });

  describe('addTenantFilter & validateTeamAccess', () => {
    it('should add tenant filter when req.tenant is populated', () => {
      req.tenant = { id: 'team-1' };
      const middleware = addTenantFilter('leads');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.tenantFilter).toEqual({ team_id: 'team-1' });
    });

    it('should validate team access for matching teamId', async () => {
      req.params = { teamId: 'team-1' };
      req.user = { team_id: 'team-1', role: 'agent' };
      await validateTeamAccess(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should reject team access for non-admin accessing another team (403)', async () => {
      req.params = { teamId: 'team-2' };
      req.user = { team_id: 'team-1', role: 'agent' };
      await validateTeamAccess(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle repository errors in validateTeamAccess (500)', async () => {
      const badReq = {
        get params() {
          throw new Error('Access error');
        }
      };
      await validateTeamAccess(badReq, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to validate team access' });
    });
  });

  describe('logActivity middleware helper', () => {
    it('should attach finish listener and call next()', async () => {
      req.user = { id: 'user-1', team_id: 'team-1' };
      const middleware = await logActivity('test_action', 'test description');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });
  });
});
