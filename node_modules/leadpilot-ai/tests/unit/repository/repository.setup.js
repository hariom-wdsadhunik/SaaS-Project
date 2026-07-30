const demoStore = require('../../../db/demoStore');

beforeEach(async () => {
  process.env.NODE_ENV = 'test';
  await demoStore.seedData();
});
