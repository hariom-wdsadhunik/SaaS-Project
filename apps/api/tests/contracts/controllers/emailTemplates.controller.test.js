const emailTemplatesController = require('../../../controllers/emailTemplatesController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Email Templates Controller Contract Tests (controllers/emailTemplatesController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/email-templates', () => {
    it('should return 200 OK with templates list', async () => {
      const templates = [{ id: 'tmpl-1', name: 'Welcome Email' }];
      jest.spyOn(repository, 'getEmailTemplates').mockResolvedValue(templates);

      await emailTemplatesController.getTemplates(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ templates });
    });
  });

  describe('GET /api/email-templates/:id', () => {
    it('should return single template by ID', async () => {
      req.params = { id: 'tmpl-1' };
      const tmpl = { id: 'tmpl-1', name: 'Welcome Email' };
      jest.spyOn(repository, 'getEmailTemplateById').mockResolvedValue(tmpl);

      await emailTemplatesController.getTemplate(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ template: tmpl });
    });

    it('should return 404 Not Found when template is missing', async () => {
      req.params = { id: 'tmpl-missing' };
      jest.spyOn(repository, 'getEmailTemplateById').mockResolvedValue(null);

      await emailTemplatesController.getTemplate(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Template not found' });
    });
  });

  describe('POST /api/email-templates & update & duplicate & preview', () => {
    it('should return 201 Created on valid template creation', async () => {
      req.body = { name: 'Follow up', subject: 'Following up', body: 'Hi {{lead_name}}' };
      const created = { id: 'tmpl-2', ...req.body };
      jest.spyOn(repository, 'createEmailTemplate').mockResolvedValue(created);

      await emailTemplatesController.createTemplate(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Template created', template: created });
    });

    it('should return 400 Bad Request when name, subject, or body is missing', async () => {
      req.body = { name: 'Incomplete' };

      await emailTemplatesController.createTemplate(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'name, subject, and body are required' });
    });

    it('should duplicate existing template', async () => {
      req.params = { id: 'tmpl-1' };
      const original = { id: 'tmpl-1', name: 'Welcome', subject: 'Sub', body: 'Body', type: 'custom', variables: [] };
      const copy = { id: 'tmpl-copy', name: 'Welcome (Copy)', subject: 'Sub', body: 'Body' };

      jest.spyOn(repository, 'getEmailTemplateById').mockResolvedValue(original);
      jest.spyOn(repository, 'createEmailTemplate').mockResolvedValue(copy);

      await emailTemplatesController.duplicateTemplate(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Template duplicated', template: copy });
    });

    it('should preview template substitution', async () => {
      req.body = { subject: 'Hello {{lead_name}}', body: 'Your budget is {{lead_budget}}', variables: { lead_name: 'Alice', lead_budget: '1 Cr' } };

      await emailTemplatesController.previewTemplate(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        preview: { subject: 'Hello Alice', body: 'Your budget is 1 Cr' }
      }));
    });
  });
});
