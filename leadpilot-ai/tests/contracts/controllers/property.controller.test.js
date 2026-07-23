const propertiesController = require('../../../controllers/propertiesController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Property Controller Contract Tests (controllers/propertiesController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/properties', () => {
    it('should return 200 OK with property list', async () => {
      const properties = [{ id: 'prop-1', title: 'DLF Cyber City Villa' }];
      jest.spyOn(repository, 'getProperties').mockResolvedValue(properties);

      await propertiesController.getProperties(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(properties);
    });

    it('should return 500 Internal Server Error on DB failure', async () => {
      jest.spyOn(repository, 'getProperties').mockRejectedValue(new Error('DB error'));

      await propertiesController.getProperties(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch properties' });
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should return 200 OK with single property details', async () => {
      req.params = { id: 'prop-1' };
      const property = { id: 'prop-1', title: '3BHK Gurgaon' };
      jest.spyOn(repository, 'getPropertyById').mockResolvedValue(property);

      await propertiesController.getProperty(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(property);
    });

    it('should return 404 Not Found when property ID does not exist', async () => {
      req.params = { id: 'prop-missing' };
      jest.spyOn(repository, 'getPropertyById').mockResolvedValue(null);

      await propertiesController.getProperty(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Property not found' });
    });
  });

  describe('POST /api/properties & PUT /api/properties/:id', () => {
    it('should return 201 Created on new property creation', async () => {
      req.body = { title: 'New Villa', price: 15000000, type: 'Villa' };
      const created = { id: 'prop-2', ...req.body };
      jest.spyOn(repository, 'createProperty').mockResolvedValue(created);

      await propertiesController.createProperty(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(created);
    });

    it('should return 200 OK on property update', async () => {
      req.params = { id: 'prop-1' };
      req.body = { price: 18000000 };
      const updated = { id: 'prop-1', price: 18000000 };
      jest.spyOn(repository, 'updateProperty').mockResolvedValue(updated);

      await propertiesController.updateProperty(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should return 200 OK when property is deleted', async () => {
      req.params = { id: 'prop-1' };
      jest.spyOn(repository, 'deleteProperty').mockResolvedValue(true);

      await propertiesController.deleteProperty(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Property deleted successfully' });
    });
  });

  describe('GET stats and matching', () => {
    it('should fetch property stats and match properties to lead', async () => {
      jest.spyOn(repository, 'getPropertyStats').mockResolvedValue({ total: 10, available: 7 });
      await propertiesController.getPropertyStats(req, res);
      expect(res.body).toEqual({ total: 10, available: 7 });

      req.params = { leadId: 'lead-1' };
      jest.spyOn(repository, 'matchPropertiesToLead').mockResolvedValue([{ id: 'prop-1', matchScore: 90 }]);
      const matchRes = createMockContext().res;
      await propertiesController.matchPropertiesToLead(req, matchRes);
      expect(matchRes.body).toEqual([{ id: 'prop-1', matchScore: 90 }]);
    });
  });
});
