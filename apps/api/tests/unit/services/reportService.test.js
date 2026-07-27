const { generateReport, getReportTypes } = require('../../../services/reportService');
const demoStore = require('../../../db/demoStore');
const repository = require('../../../db');

describe('Report Service Unit Tests (services/reportService.js)', () => {
  let req, res;

  beforeEach(async () => {
    await demoStore.seedData();
    req = {
      user: { id: 'user-1', team_id: 'team-1' },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn().mockReturnThis()
    };
  });

  it('should return available report types', async () => {
    await getReportTypes(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        types: expect.arrayContaining([
          expect.objectContaining({ id: 'leads' }),
          expect.objectContaining({ id: 'deals' }),
          expect.objectContaining({ id: 'performance' }),
          expect.objectContaining({ id: 'activity' })
        ])
      })
    );
  });

  it('should return 400 when teamId is missing', async () => {
    req.user = null;
    req.body = { type: 'leads' };

    await generateReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Team ID required' });
  });

  it('should return 400 when report type is invalid or missing', async () => {
    req.body = { type: 'invalid_type' };

    await generateReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid report type' });
  });

  it('should generate leads report with date, status, and source filters in HTML format', async () => {
    req.body = {
      type: 'leads',
      format: 'html',
      startDate: '2020-01-01',
      endDate: '2030-12-31',
      filters: { status: 'new', source: 'website' }
    };

    await generateReport(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Leads by Status'));
  });

  it('should generate deals report in HTML format across various deal value currency thresholds', async () => {
    await repository.createDeal({ title: 'Crores Deal', deal_value: 50000000, commission_amount: 1000000, deal_stage: 'Closed Won', team_id: 'team-1' });
    await repository.createDeal({ title: 'Lakhs Deal', deal_value: 500000, commission_amount: 10000, deal_stage: 'Closed Won', team_id: 'team-1' });
    await repository.createDeal({ title: 'Thousands Deal', deal_value: 5000, commission_amount: 100, deal_stage: 'Closed Won', team_id: 'team-1' });
    await repository.createDeal({ title: 'Small Deal', deal_value: 500, commission_amount: 10, deal_stage: 'Closed Won', team_id: 'team-1' });
    await repository.createDeal({ title: 'Zero Deal', deal_value: 0, commission_amount: 0, deal_stage: 'Closed Lost', team_id: 'team-1' });

    req.body = {
      type: 'deals',
      format: 'html',
      startDate: '2020-01-01',
      endDate: '2030-12-31'
    };

    await generateReport(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Deals by Stage'));
  });

  it('should generate performance report in HTML format', async () => {
    req.body = { type: 'performance', format: 'html' };

    await generateReport(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Top Performers'));
  });

  it('should generate activity report successfully with date filters', async () => {
    req.body = {
      type: 'activity',
      format: 'json',
      startDate: '2020-01-01',
      endDate: '2030-12-31'
    };

    await generateReport(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        report: expect.objectContaining({
          type: 'activity'
        })
      })
    );
  });

  it('should handle internal generator errors with 500 status', async () => {
    jest.spyOn(repository, 'getLeads').mockRejectedValueOnce(new Error('Leads DB Error'));
    req.body = { type: 'leads', format: 'json' };

    await generateReport(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
