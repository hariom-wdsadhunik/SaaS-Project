const { request, app } = require('../helpers/app');
require('../helpers/setup');

describe('GET /health API Smoke Test', () => {
  it('should return 200 OK and health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
