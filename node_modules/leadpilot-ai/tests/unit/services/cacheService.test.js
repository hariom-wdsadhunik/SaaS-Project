const { cacheService, withCache } = require('../../../services/cacheService');
const { config } = require('../../../config');

describe('Cache Service Unit Tests (services/cacheService.js)', () => {
  let req, res, next;

  beforeEach(() => {
    cacheService.isConnected = false;
    cacheService.client = null;
    req = { url: '/api/leads', query: {} };
    res = {
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should return null / false when Redis is not connected', async () => {
    expect(await cacheService.get('test_key')).toBeNull();
    expect(await cacheService.set('test_key', { a: 1 })).toBe(false);
    expect(await cacheService.del('test_key')).toBe(false);
    expect(await cacheService.delPattern('test_*')).toBe(false);
  });

  it('should construct composite cache keys correctly', () => {
    const key = cacheService.buildKey('leads', 'team1', 'page1');
    expect(key).toBe('leads:team1:page1');
  });

  it('should execute fetchFn and set cache in getOrSet when cache miss occurs', async () => {
    const fetchFn = jest.fn().mockResolvedValue({ id: '123', name: 'Test' });
    const result = await cacheService.getOrSet('test_key', fetchFn);

    expect(fetchFn).toHaveBeenCalled();
    expect(result).toEqual({ id: '123', name: 'Test' });
  });

  it('should return cached item in getOrSet without executing fetchFn on cache hit', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue(JSON.stringify({ cached: true }))
    };
    cacheService.client = mockClient;
    cacheService.isConnected = true;

    const fetchFn = jest.fn();
    const result = await cacheService.getOrSet('test_key', fetchFn);

    expect(fetchFn).not.toHaveBeenCalled();
    expect(result).toEqual({ cached: true });
  });

  it('should pass through request in withCache middleware when Redis is disconnected', async () => {
    const middleware = withCache((req) => `cache:${req.url}`);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return cached JSON response in withCache middleware when cache hit occurs', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue(JSON.stringify({ success: true, data: [1, 2] }))
    };
    cacheService.client = mockClient;
    cacheService.isConnected = true;

    const middleware = withCache((req) => `cache:${req.url}`);
    await middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [1, 2], cached: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle connect() when Redis URL is not configured', async () => {
    config.redis.url = '';
    await cacheService.connect();
    expect(cacheService.isConnected).toBe(false);
  });

  it('should simulate connected Redis operations (get, set, del, delPattern)', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue(JSON.stringify({ value: 'hello' })),
      setEx: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      keys: jest.fn().mockResolvedValue(['k1', 'k2'])
    };

    cacheService.client = mockClient;
    cacheService.isConnected = true;

    expect(await cacheService.get('k1')).toEqual({ value: 'hello' });
    expect(await cacheService.set('k1', { value: 'hello' })).toBe(true);
    expect(await cacheService.del('k1')).toBe(true);
    expect(await cacheService.delPattern('k*')).toBe(true);
  });

  it('should handle errors gracefully in cache operations', async () => {
    const mockClient = {
      get: jest.fn().mockRejectedValue(new Error('Redis GET Error')),
      setEx: jest.fn().mockRejectedValue(new Error('Redis SET Error')),
      del: jest.fn().mockRejectedValue(new Error('Redis DEL Error')),
      keys: jest.fn().mockRejectedValue(new Error('Redis KEYS Error'))
    };

    cacheService.client = mockClient;
    cacheService.isConnected = true;

    expect(await cacheService.get('k1')).toBeNull();
    expect(await cacheService.set('k1', 'val')).toBe(false);
    expect(await cacheService.del('k1')).toBe(false);
    expect(await cacheService.delPattern('k*')).toBe(false);
  });

  it('should intercept res.json and cache response in withCache middleware', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue(null),
      setEx: jest.fn().mockResolvedValue('OK')
    };
    cacheService.client = mockClient;
    cacheService.isConnected = true;

    const middleware = withCache((req) => `cache:${req.url}`);
    const testRes = {
      json: function(data) {
        return data;
      }
    };

    await middleware(req, testRes, next);
    expect(next).toHaveBeenCalled();

    testRes.json({ success: true, data: [1, 2, 3] });
    expect(mockClient.setEx).toHaveBeenCalled();
  });
});
