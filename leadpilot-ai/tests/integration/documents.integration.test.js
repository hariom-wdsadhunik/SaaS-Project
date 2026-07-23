const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Documents API Integration Tests (routes/documents.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should upload document with file buffer, fetch stats, and retrieve upload presigned URL', async () => {
    const uploadRes = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('lead_id', 'lead-1')
      .field('document_name', 'Sale Deed')
      .attach('file', Buffer.from('PDF Content Dummy'), { filename: 'sale_deed.pdf', contentType: 'application/pdf' });

    expect(uploadRes.statusCode).toBe(201);
    expect(uploadRes.body).toHaveProperty('document');

    const statsRes = await request(app)
      .get('/api/documents/stats/overview')
      .set('Authorization', `Bearer ${token}`);

    expect(statsRes.statusCode).toBe(200);

    const urlRes = await request(app)
      .get('/api/documents/upload-url?fileName=deed.pdf&contentType=application/pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(urlRes.statusCode).toBe(200);
    expect(urlRes.body).toHaveProperty('uploadUrl');
  });
});
