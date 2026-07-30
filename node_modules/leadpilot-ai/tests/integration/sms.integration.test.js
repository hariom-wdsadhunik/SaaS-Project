const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('SMS API Integration Tests (routes/sms.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should fetch SMS configuration status and logs', async () => {
    const statusRes = await request(app)
      .get('/api/sms/status')
      .set('Authorization', `Bearer ${token}`);

    expect(statusRes.statusCode).toBe(200);

    const logsRes = await request(app)
      .get('/api/sms/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(logsRes.statusCode).toBe(200);
    expect(logsRes.body).toHaveProperty('logs');
  });
});
