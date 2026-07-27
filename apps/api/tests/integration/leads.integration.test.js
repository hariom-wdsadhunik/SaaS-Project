const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Leads API Integration Tests (routes/leads.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  describe('CRUD operations for /api/leads', () => {
    it('should create a new lead via POST /api/leads', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phone: '9876543210',
          name: 'Integration Test Lead',
          budget: '1.2 Cr',
          location: 'DLF Phase 5, Gurgaon',
          source: 'website'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Integration Test Lead');
      expect(res.body.created_by).toBeDefined();
    });

    it('should fetch list of leads with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/leads?page=1&limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should fetch single lead by ID via GET /api/leads/:id', async () => {
      const createRes = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '9991112223', name: 'Single Lead' });

      const leadId = createRes.body.id;

      const res = await request(app)
        .get(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(leadId);
      expect(res.body.name).toBe('Single Lead');
    });

    it('should return 404 Not Found for non-existent lead ID', async () => {
      const res = await request(app)
        .get('/api/leads/non-existent-id-999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Lead not found' });
    });

    it('should update lead status via PATCH /api/leads/:id', async () => {
      const createRes = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '9992223334', name: 'Status Lead' });

      const leadId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'contacted' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('contacted');
    });

    it('should delete lead via DELETE /api/leads/:id', async () => {
      const createRes = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '9993334445', name: 'Delete Lead' });

      const leadId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Lead deleted successfully' });
    });
  });
});
