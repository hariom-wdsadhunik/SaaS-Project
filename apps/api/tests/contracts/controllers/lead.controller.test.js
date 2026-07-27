const leadsController = require('../../../controllers/leadsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Lead Controller Contract Tests (controllers/leadsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/leads', () => {
    it('should return 200 OK with paginated list of leads', async () => {
      req.query = { page: 1, limit: 10 };
      const mockResult = {
        data: [{ id: 'lead-1', name: 'John Doe', phone: '9876543210' }],
        total: 1,
        page: 1,
        limit: 10
      };
      jest.spyOn(repository, 'getLeads').mockResolvedValue(mockResult);

      await leadsController.getLeads(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockResult);
      expect(repository.getLeads).toHaveBeenCalledWith(req.query);
    });

    it('should return 500 Internal Server Error when repository error occurs', async () => {
      jest.spyOn(repository, 'getLeads').mockRejectedValue(new Error('Repository failure'));

      await leadsController.getLeads(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch leads' });
    });
  });

  describe('GET /api/leads/:id', () => {
    it('should return 200 OK with requested lead object', async () => {
      req.params = { id: 'lead-1' };
      const mockLead = { id: 'lead-1', name: 'John Doe', status: 'new' };
      jest.spyOn(repository, 'getLeadById').mockResolvedValue(mockLead);

      await leadsController.getSingleLead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockLead);
    });

    it('should return 404 Not Found when lead ID does not exist', async () => {
      req.params = { id: 'lead-non-existent' };
      jest.spyOn(repository, 'getLeadById').mockResolvedValue(null);

      await leadsController.getSingleLead(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Lead not found' });
    });

    it('should return 500 Internal Server Error when DB query fails', async () => {
      req.params = { id: 'lead-1' };
      jest.spyOn(repository, 'getLeadById').mockRejectedValue(new Error('DB err'));

      await leadsController.getSingleLead(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch lead' });
    });
  });

  describe('POST /api/leads', () => {
    it('should return 201 Created with created lead and activity log metadata', async () => {
      req.body = { phone: '9876543210', name: 'Jane Doe', budget: '1 Cr' };
      const createdLead = { id: 'lead-2', ...req.body, created_by: 'user-1', team_id: 'team-1' };

      jest.spyOn(repository, 'createLead').mockResolvedValue(createdLead);
      jest.spyOn(repository, 'logActivity').mockResolvedValue({});

      await leadsController.createLead(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdLead);
      expect(repository.logActivity).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'lead_created', metadata: { lead_id: 'lead-2' } })
      );
    });

    it('should return 500 Internal Server Error when creation fails', async () => {
      req.body = { phone: '9876543210' };
      jest.spyOn(repository, 'createLead').mockRejectedValue(new Error('Create error'));

      await leadsController.createLead(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to create lead' });
    });
  });

  describe('PUT /api/leads/:id', () => {
    it('should return 200 OK with updated lead object and log activity', async () => {
      req.params = { id: 'lead-1' };
      req.body = { status: 'contacted' };
      const updatedLead = { id: 'lead-1', status: 'contacted' };

      jest.spyOn(repository, 'updateLead').mockResolvedValue(updatedLead);
      jest.spyOn(repository, 'logActivity').mockResolvedValue({});

      await leadsController.updateLeadStatus(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedLead);
    });

    it('should return 404 Not Found if lead to update does not exist', async () => {
      req.params = { id: 'lead-99' };
      req.body = { status: 'contacted' };

      jest.spyOn(repository, 'updateLead').mockResolvedValue(null);

      await leadsController.updateLeadStatus(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Lead not found' });
    });
  });

  describe('DELETE /api/leads/:id', () => {
    it('should return 200 OK with success message when lead is deleted', async () => {
      req.params = { id: 'lead-1' };
      jest.spyOn(repository, 'deleteLead').mockResolvedValue(true);

      await leadsController.deleteLead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Lead deleted successfully' });
    });

    it('should return 404 Not Found when lead to delete is not found', async () => {
      req.params = { id: 'lead-99' };
      jest.spyOn(repository, 'deleteLead').mockResolvedValue(false);

      await leadsController.deleteLead(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Lead not found' });
    });
  });
});
