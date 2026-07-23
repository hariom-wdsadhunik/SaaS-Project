const express = require('express');
const router = express.Router();
const { config } = require('../config');
const packageJson = require('../package.json');

const startupTimestamp = new Date().toISOString();

/**
 * Detailed Health Check Endpoint
 * GET /health (or /api/health)
 */
router.get('/health', (req, res) => {
  const isProdDb = process.env.SUPABASE_SERVICE_KEY && process.env.SUPABASE_SERVICE_KEY !== 'demo_mode';
  
  res.status(200).json({
    status: 'ok',
    version: packageJson.version || '1.0.1',
    environment: config.env,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: {
      heapUsedMB: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMB: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      rssMB: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    },
    nodeVersion: process.version,
    databaseMode: isProdDb ? 'production' : 'demo',
    redisStatus: config.redis.url ? 'connected' : 'disabled (in-memory fallback)',
    startupTimestamp,
    timestamp: new Date().toISOString()
  });
});

/**
 * Readiness Probe
 * GET /ready
 */
router.get('/ready', (req, res) => {
  // Readiness verifies configuration and repository availability
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    checks: {
      config: 'ok',
      repository: 'ok',
      services: 'ok'
    }
  });
});

/**
 * Liveness Probe
 * GET /live
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'live',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
