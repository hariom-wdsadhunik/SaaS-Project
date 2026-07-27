const { app, request, getAuthToken, setupTestData } = require('./reliability.setup');

describe('API Stress & Latency Measurement Tests (Step 8)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should process 100+ requests under stress conditions and maintain stability', async () => {
    const latencies = [];
    const memoryBefore = process.memoryUsage().heapUsed;
    const requestCount = 100;

    const promises = [];
    for (let i = 0; i < requestCount; i++) {
      const start = Date.now();
      const p = request(app)
        .get('/api/leads?page=1&limit=5')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          const duration = Date.now() - start;
          latencies.push(duration);
          return res;
        });
      promises.push(p);
    }

    const responses = await Promise.all(promises);
    const memoryAfter = process.memoryUsage().heapUsed;

    const successCount = responses.filter((r) => r.statusCode === 200).length;
    expect(successCount).toBe(requestCount);

    latencies.sort((a, b) => a - b);
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / requestCount;
    const p95Index = Math.floor(requestCount * 0.95);
    const p95Latency = latencies[p95Index];
    const slowestLatency = latencies[latencies.length - 1];

    console.log(`📊 Stress Metrics (100 Requests):`);
    console.log(`   - Total Successful Requests: ${successCount}/${requestCount}`);
    console.log(`   - Average Latency: ${avgLatency.toFixed(2)} ms`);
    console.log(`   - 95th Percentile Latency: ${p95Latency} ms`);
    console.log(`   - Slowest Response Time: ${slowestLatency} ms`);
    console.log(`   - Heap Memory Delta: ${((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2)} MB`);

    expect(avgLatency).toBeLessThan(1000); // Expect sub-1000ms average under 100 concurrent requests
    expect(p95Latency).toBeLessThan(1500); // Expect sub-1500ms 95th percentile
  });
});
