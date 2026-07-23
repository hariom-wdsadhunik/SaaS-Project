const { request, app } = require('../../helpers/app');

describe('Global Error Handler Middleware Unit Tests (server.js)', () => {
  it('should handle unhandled routes with 404 Not Found', async () => {
    const res = await request(app).get('/api/non-existent-route-999');
    expect(res.statusCode).toBe(404);
  });

  it('should process CORS options correctly for preflight OPTIONS request', async () => {
    const res = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST');

    expect(res.statusCode).toBe(204);
  });
});
