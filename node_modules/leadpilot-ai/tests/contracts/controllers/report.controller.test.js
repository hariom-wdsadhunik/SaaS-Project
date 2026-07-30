const { generateReport, getReportTypes } = require('../../../services/reportService');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Report Controller Contract Tests (services/reportService.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/reports/types', () => {
    it('should return available report types', async () => {
      await getReportTypes(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        types: expect.arrayContaining([
          expect.objectContaining({ id: 'leads' }),
          expect.objectContaining({ id: 'deals' }),
          expect.objectContaining({ id: 'performance' }),
          expect.objectContaining({ id: 'activity' })
        ])
      });
    });
  });

  describe('POST /api/reports/generate', () => {
    it('should generate leads report in JSON format', async () => {
      req.body = { type: 'leads', format: 'json' };
      jest.spyOn(repository, 'getLeads').mockResolvedValue({ data: [{ id: 'lead-1', status: 'new', source: 'website' }] });

      await generateReport(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        report: expect.objectContaining({ type: 'leads' })
      });
    });

    it('should return 400 Bad Request when team ID is missing', async () => {
      req.user = null;
      req.body = { type: 'leads' };

      await generateReport(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Team ID required' });
    });

    it('should return 400 Bad Request when report type is invalid', async () => {
      req.body = { type: 'unknown_report' };

      await generateReport(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid report type' });
    });

    it('should generate HTML report with correct Content-Type header', async () => {
      req.body = { type: 'deals', format: 'html' };
      jest.spyOn(repository, 'getDeals').mockResolvedValue({ data: [] });

      await generateReport(req, res);

      expect(res.headers['Content-Type']).toBe('text/html');
      expect(res.body).toContain('<!DOCTYPE html>');
    });
  });
});
