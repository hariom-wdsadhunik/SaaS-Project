const request = require('supertest');
const app = require('../../server');
const demoStore = require('../../db/demoStore');

let cachedToken = null;

/**
 * Reset and seed test store before reliability test runs
 */
async function setupTestData() {
  await demoStore.seedData();
}

/**
 * Get authenticated Bearer token for protected endpoint load testing
 */
async function getAuthToken() {
  if (cachedToken) return cachedToken;
  await setupTestData();

  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@leadpilot.ai',
      password: 'admin123'
    });

  if (response.body && response.body.token) {
    cachedToken = response.body.token;
    return cachedToken;
  }
  throw new Error('Failed to obtain authentication token during setup');
}

/**
 * Execute worker function N times concurrently
 */
async function runParallel(count, workerFn) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(workerFn(i));
  }
  return Promise.all(promises);
}

module.exports = {
  app,
  request,
  setupTestData,
  getAuthToken,
  runParallel
};
