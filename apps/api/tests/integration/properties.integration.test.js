const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Properties API Integration Tests (routes/properties.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should create property, fetch overview stats, and match to lead requirements', async () => {
    const propRes = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Luxury 4BHK Penthouse', price: 35000000, bhk: 4, location: 'Gurgaon' });

    expect(propRes.statusCode).toBe(201);
    expect(propRes.body.id).toBeDefined();

    const statsRes = await request(app)
      .get('/api/properties/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(statsRes.statusCode).toBe(200);

    const matchRes = await request(app)
      .get('/api/properties/match/lead-1')
      .set('Authorization', `Bearer ${token}`);

    expect(matchRes.statusCode).toBe(200);
    expect(Array.isArray(matchRes.body)).toBe(true);
  });
});
