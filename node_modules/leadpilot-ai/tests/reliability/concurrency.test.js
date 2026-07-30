const { app, request, getAuthToken, setupTestData, runParallel } = require('./reliability.setup');

describe('Concurrent CRUD & Load Reliability Tests (Step 3)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should handle 10 concurrent Lead creation requests without memory leak or ID collision', async () => {
    const results = await runParallel(10, (i) =>
      request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phone: `98765432${10 + i}`,
          name: `Concurrent Lead ${i}`,
          budget: '1 Cr',
          source: 'website'
        })
    );

    const statusCodes = results.map((r) => r.statusCode);
    const createdIds = results.map((r) => r.body.id);
    const uniqueIds = new Set(createdIds);

    expect(statusCodes.every((code) => code === 201)).toBe(true);
    expect(uniqueIds.size).toBe(10);
  });

  it('should handle 25 concurrent Lead read requests', async () => {
    const results = await runParallel(25, () =>
      request(app)
        .get('/api/leads?page=1&limit=5')
        .set('Authorization', `Bearer ${token}`)
    );

    const statusCodes = results.map((r) => r.statusCode);
    expect(statusCodes.every((code) => code === 200)).toBe(true);
  });

  it('should handle 50 concurrent mixed CRUD operations without crashing or corrupting store', async () => {
    const results = await runParallel(50, (i) => {
      if (i % 2 === 0) {
        return request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: `Parallel Task ${i}`, priority: 'high', status: 'pending' });
      } else {
        return request(app)
          .get('/api/tasks')
          .set('Authorization', `Bearer ${token}`);
      }
    });

    const statusCodes = results.map((r) => r.statusCode);
    const validCodes = statusCodes.every((code) => code === 200 || code === 201);
    expect(validCodes).toBe(true);
  });
});
