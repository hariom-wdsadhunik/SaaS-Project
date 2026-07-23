const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Security & Edge-Case Integration Tests (Step 7)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  describe('Unauthorized & Forbidden Access', () => {
    it('should reject unauthenticated requests to protected endpoints (401)', async () => {
      const res = await request(app).get('/api/leads');
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Access token required' });
    });

    it('should reject malformed authorization token (403)', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', 'Bearer bad_token_string');

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({ error: 'Invalid or expired token' });
    });
  });

  describe('Input Validation & Payload Boundaries', () => {
    it('should return 400 Bad Request on Zod schema validation failure', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '123' }); // Invalid phone format

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('details');
    });

    it('should reject malformed JSON body payload', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid_json: ');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
      expect(res.body.requestId).toBeDefined();
    });
  });

  describe('CORS Policy Verification', () => {
    it('should allow requests without origin header (curl/server-to-server)', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
