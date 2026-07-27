const { createClient } = require("redis");
const { config } = require("../config");

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.defaultTTL = 300;
  }

  async connect() {
    if (!config.redis.url) {
      console.log("Redis URL not configured, caching disabled");
      return;
    }

    try {
      this.client = createClient({ url: config.redis.url });
      
      this.client.on("error", (err) => {
        console.error("Redis error:", err);
        this.isConnected = false;
      });

      this.client.on("connect", () => {
        console.log("Redis connected");
        this.isConnected = true;
      });

      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      console.error("Failed to connect to Redis:", error.message);
      this.isConnected = false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache get error:", error.message);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    if (!this.isConnected) return false;
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Cache set error:", error.message);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error.message);
      return false;
    }
  }

  async delPattern(pattern) {
    if (!this.isConnected) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error("Cache delete pattern error:", error.message);
      return false;
    }
  }

  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    if (data !== null) {
      await this.set(key, data, ttl);
    }
    return data;
  }

  buildKey(prefix, ...parts) {
    return [prefix, ...parts].join(":");
  }
}

const cacheService = new CacheService();

const withCache = (keyBuilder, ttl = 300) => {
  return async (req, res, next) => {
    const key = keyBuilder(req);
    const cached = await cacheService.get(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (data && !data.error) {
        cacheService.set(key, data, ttl);
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = { cacheService, withCache };
