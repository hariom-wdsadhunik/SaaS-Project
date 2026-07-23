const importController = require('../../../controllers/importController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Import Controller Contract Tests (controllers/importController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('POST /api/import/leads', () => {
    it('should return 400 Bad Request when fileData is missing', async () => {
      req.body = {};

      await importController.importLeads(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'File data is required' });
    });

    it('should parse base64 CSV file and import leads', async () => {
      const csvContent = 'phone,name,email,budget,source\n9998887770,Alice,alice@example.com,1 Cr,website';
      const base64Data = Buffer.from(csvContent).toString('base64');

      req.body = { fileData: base64Data, fileName: 'leads.csv' };

      jest.spyOn(repository, 'getLeads').mockResolvedValue({ data: [] });
      jest.spyOn(repository, 'createLead').mockResolvedValue({ id: 'lead-10', phone: '9998887770' });
      jest.spyOn(repository, 'createNote').mockResolvedValue({});
      jest.spyOn(repository, 'logActivity').mockResolvedValue({});

      await importController.importLeads(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        message: expect.stringContaining('Import complete'),
        results: expect.objectContaining({ imported: 1, skipped: 0 })
      }));
    });
  });

  describe('GET /api/import/template & POST /api/import/export', () => {
    it('should return import CSV template structure and instructions', async () => {
      await importController.getImportTemplate(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        headers: expect.arrayContaining(['phone', 'name', 'email']),
        instructions: expect.any(Array)
      }));
    });

    it('should export leads to base64 encoded CSV string', async () => {
      req.body = { format: 'csv' };
      const leads = [{ id: 'l1', phone: '9998887770', name: 'Bob', status: 'new' }];

      jest.spyOn(repository, 'getLeads').mockResolvedValue({ data: leads });
      jest.spyOn(repository, 'logActivity').mockResolvedValue({});

      await importController.exportLeads(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        message: 'Exported 1 leads',
        format: 'csv',
        data: expect.any(String),
        filename: expect.stringContaining('leads_export_')
      }));
    });
  });
});
