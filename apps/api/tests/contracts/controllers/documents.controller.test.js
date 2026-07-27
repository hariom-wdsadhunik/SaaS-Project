const documentsController = require('../../../controllers/documentsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Documents Controller Contract Tests (controllers/documentsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/documents', () => {
    it('should return 200 OK with document list', async () => {
      const docs = [{ id: 'doc-1', document_name: 'Deed.pdf' }];
      jest.spyOn(repository, 'getDocuments').mockResolvedValue(docs);

      await documentsController.getDocuments(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(docs);
    });
  });

  describe('GET /api/documents/:id', () => {
    it('should return single document by ID', async () => {
      req.params = { id: 'doc-1' };
      const doc = { id: 'doc-1', document_name: 'Deed.pdf' };
      jest.spyOn(repository, 'getDocumentById').mockResolvedValue(doc);

      await documentsController.getDocument(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(doc);
    });

    it('should return 404 Not Found when document does not exist', async () => {
      req.params = { id: 'doc-missing' };
      jest.spyOn(repository, 'getDocumentById').mockResolvedValue(null);

      await documentsController.getDocument(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Document not found' });
    });
  });

  describe('Upload & Upload URL contract', () => {
    it('should return 400 Bad Request when uploading without file', async () => {
      req.file = null;
      await documentsController.uploadDocument(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'No file uploaded' });
    });

    it('should return 400 Bad Request when uploading unallowed file type', async () => {
      req.file = { mimetype: 'application/x-msdownload', originalname: 'malware.exe' };
      await documentsController.uploadDocument(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(expect.objectContaining({ error: 'Invalid file type' }));
    });

    it('should upload allowed file type and return 201 Created', async () => {
      req.file = { mimetype: 'application/pdf', originalname: 'contract.pdf', size: 2048, buffer: Buffer.from('test') };
      req.body = { lead_id: 'lead-1', document_name: 'Contract' };
      const created = { id: 'doc-2', document_name: 'Contract', file_url: '/demo-uploads/file.pdf' };

      jest.spyOn(repository, 'createDocument').mockResolvedValue(created);
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await documentsController.uploadDocument(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({ message: 'File uploaded successfully', document: created }));
    });

    it('should return presigned upload URL or 400 Bad Request when fileName/contentType missing', async () => {
      req.query = {};
      await documentsController.getUploadUrl(req, res);
      expect(res.statusCode).toBe(400);

      req.query = { fileName: 'contract.pdf', contentType: 'application/pdf' };
      const urlRes = createMockContext().res;
      await documentsController.getUploadUrl(req, urlRes);
      expect(urlRes.statusCode).toBe(200);
      expect(urlRes.body).toEqual(expect.objectContaining({ uploadUrl: expect.any(String), storagePath: expect.any(String) }));
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('should delete document and return 200 OK', async () => {
      req.params = { id: 'doc-1' };
      jest.spyOn(repository, 'getDocumentById').mockResolvedValue({ id: 'doc-1' });
      jest.spyOn(repository, 'deleteDocument').mockResolvedValue(true);

      await documentsController.deleteDocument(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Document deleted successfully' });
    });
  });
});
