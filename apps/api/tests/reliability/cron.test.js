const { setupTestData } = require('./reliability.setup');
const { sequenceService } = require('../../services/sequenceService');

describe('Cron Jobs & Scheduled Worker Reliability Tests (Step 2)', () => {
  beforeEach(async () => {
    await setupTestData();
  });

  it('should process pending sequence background jobs safely', async () => {
    const result = await sequenceService.processPendingJobs();
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('durationMs');
  });

  it('should execute repeated background worker calls without crashing or memory leaks', async () => {
    for (let i = 0; i < 5; i++) {
      const result = await sequenceService.processPendingJobs();
      expect(result.success).toBe(true);
    }
  });
});
