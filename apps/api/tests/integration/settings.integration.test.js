const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Settings API Integration Tests (routes/settings.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should fetch user settings and update preferences', async () => {
    const getRes = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);

    const postRes = await request(app)
      .post('/api/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ key: 'theme', value: 'dark' });

    expect(postRes.statusCode).toBe(200);
    expect(postRes.body.setting).toBeDefined();
  });
});
