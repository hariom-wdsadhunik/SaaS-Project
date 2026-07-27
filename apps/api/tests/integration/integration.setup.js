const request = require('supertest');
const app = require('../../server');
const demoStore = require('../../db/demoStore');

let cachedToken = null;

/**
 * Initialize test data store before running integration tests.
 */
async function setupTestData() {
  await demoStore.seedData();
}

/**
 * Obtain a valid JWT Bearer token for protected integration endpoint testing.
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

module.exports = {
  app,
  request,
  setupTestData,
  getAuthToken
};
