const demoStore = require('../../db/demoStore');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await demoStore.seedData();
});
