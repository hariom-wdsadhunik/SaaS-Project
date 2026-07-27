const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Analytics API Integration Tests (routes/analytics.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should fetch dashboard analytics, lead trends, and AI insights', async () => {
    const dashRes = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(dashRes.statusCode).toBe(200);

    const trendsRes = await request(app)
      .get('/api/analytics/trends?period=14')
      .set('Authorization', `Bearer ${token}`);

    expect(trendsRes.statusCode).toBe(200);
    expect(trendsRes.body).toHaveProperty('trends');

    const aiRes = await request(app)
      .get('/api/analytics/insights')
      .set('Authorization', `Bearer ${token}`);

    expect(aiRes.statusCode).toBe(200);
    expect(aiRes.body).toHaveProperty('averageScore');
  });
});
