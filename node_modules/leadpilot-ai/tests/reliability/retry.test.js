const { setupTestData } = require('./reliability.setup');

describe('Retry & Graceful Degradation Tests (Step 6)', () => {
  beforeEach(async () => {
    await setupTestData();
  });

  /**
   * Helper function implementing exponential backoff retry for transient external failures
   */
  async function executeWithRetry(fn, maxRetries = 3, initialDelayMs = 10) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(attempt);
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, initialDelayMs * Math.pow(2, attempt - 1)));
        }
      }
    }
    throw lastError;
  }

  it('should retry transient repository/external API failures and succeed on retry', async () => {
    let attempts = 0;
    const mockTransientOperation = jest.fn(async () => {
      attempts++;
      if (attempts === 1) {
        throw new Error('Transient network timeout');
      }
      return { success: true, messageId: 'msg-123' };
    });

    const result = await executeWithRetry(mockTransientOperation, 3, 5);

    expect(attempts).toBe(2);
    expect(result).toEqual({ success: true, messageId: 'msg-123' });
  });

  it('should handle retry exhaustion gracefully when external API fails permanently', async () => {
    let attempts = 0;
    const mockPermanentErrorOperation = jest.fn(async () => {
      attempts++;
      throw new Error('Permanent API Authentication Failure');
    });

    let caughtError = null;
    try {
      await executeWithRetry(mockPermanentErrorOperation, 3, 5);
    } catch (err) {
      caughtError = err;
    }

    expect(attempts).toBe(3);
    expect(caughtError).toBeDefined();
    expect(caughtError.message).toBe('Permanent API Authentication Failure');
  });
});
