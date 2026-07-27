const request = require('supertest');
const app = require('../../server');

describe('Production Readiness & Health Endpoints Integration Tests', () => {
  describe('GET /health & GET /api/health', () => {
    it('should return 200 OK with detailed system health metrics', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('ok');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('environment');
      expect(res.body).toHaveProperty('uptimeSeconds');
      expect(res.body).toHaveProperty('memoryUsage');
      expect(res.body.memoryUsage).toHaveProperty('heapUsedMB');
      expect(res.body).toHaveProperty('nodeVersion');
      expect(res.body).toHaveProperty('databaseMode');
      expect(res.body).toHaveProperty('redisStatus');
      expect(res.body).toHaveProperty('startupTimestamp');
    });

    it('should return 200 OK under /api/health', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('ok');
    });
  });

  describe('GET /ready (Readiness Probe)', () => {
    it('should return 200 OK with readiness check breakdown', async () => {
      const res = await request(app).get('/ready');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('ready');
      expect(res.body.checks).toEqual({
        config: 'ok',
        repository: 'ok',
        services: 'ok'
      });
    });
  });

  describe('GET /live (Liveness Probe)', () => {
    it('should return 200 OK with process uptime', async () => {
      const res = await request(app).get('/live');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('live');
      expect(typeof res.body.uptimeSeconds).toBe('number');
    });
  });

  describe('Request Correlation & Security Headers', () => {
    it('should attach unique X-Request-ID to res headers and error responses', async () => {
      const res = await request(app).get('/api/non-existent-route');
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.body.requestId).toEqual(res.headers['x-request-id']);
    });

    it('should preserve provided X-Request-ID header if sent by client', async () => {
      const customReqId = 'custom-test-req-id-12345';
      const res = await request(app)
        .get('/health')
        .set('X-Request-ID', customReqId);
      expect(res.headers['x-request-id']).toEqual(customReqId);
    });

    it('should include production security headers from Helmet', async () => {
      const res = await request(app).get('/health');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['referrer-policy']).toEqual('strict-origin-when-cross-origin');
    });
  });
});
