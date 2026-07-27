const repository = require('../../../db');

/**
 * Creates realistic Express request and response objects for controller contract testing.
 */
function createMockContext(overrides = {}) {
  const req = {
    user: { id: 'user-1', name: 'Admin User', email: 'admin@leadpilot.ai', role: 'admin', team_id: 'team-1' },
    params: {},
    query: {},
    body: {},
    headers: {},
    ...overrides
  };

  const res = {
    statusCode: 200,
    headers: {},
    status: jest.fn().mockImplementation(function (code) {
      res.statusCode = code;
      return res;
    }),
    json: jest.fn().mockImplementation(function (data) {
      res.body = data;
      return res;
    }),
    send: jest.fn().mockImplementation(function (data) {
      res.body = data;
      return res;
    }),
    setHeader: jest.fn().mockImplementation(function (key, value) {
      res.headers[key] = value;
      return res;
    }),
    sendStatus: jest.fn().mockImplementation(function (code) {
      res.statusCode = code;
      return res;
    })
  };

  return { req, res };
}

module.exports = {
  createMockContext
};
