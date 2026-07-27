const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Deals API Integration Tests (routes/deals.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  describe('CRUD & Stage Workflow for /api/deals', () => {
    it('should create a deal', async () => {
      const res = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Integration Test Apartment',
          deal_value: 10000000,
          deal_stage: 'Negotiation'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Integration Test Apartment');
    });

    it('should fetch deal pipeline overview stats', async () => {
      const res = await request(app)
        .get('/api/deals/pipeline/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should transition deal to Closed Won and record payment', async () => {
      const createRes = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Won Deal', deal_value: 5000000 });

      const dealId = createRes.body.id;

      const wonRes = await request(app)
        .patch(`/api/deals/${dealId}/close-won`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Payment cleared' });

      expect(wonRes.statusCode).toBe(200);
      expect(wonRes.body.deal_stage).toBe('Closed Won');

      const payRes = await request(app)
        .patch(`/api/deals/${dealId}/payment`)
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 100000 });

      expect(payRes.statusCode).toBe(200);
      expect(payRes.body.payment_status).toBe('Received');
    });
  });
});
