const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Email Templates API Integration Tests (routes/email.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should fetch email templates list and allowed template variables', async () => {
    const templatesRes = await request(app)
      .get('/api/email/templates')
      .set('Authorization', `Bearer ${token}`);

    expect(templatesRes.statusCode).toBe(200);
    expect(Array.isArray(templatesRes.body.templates)).toBe(true);

    const varsRes = await request(app)
      .get('/api/email/templates/variables')
      .set('Authorization', `Bearer ${token}`);

    expect(varsRes.statusCode).toBe(200);
    expect(varsRes.body).toHaveProperty('variables');
  });

  it('should create template and preview template substitution', async () => {
    const createRes = await request(app)
      .post('/api/email/templates')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Welcome Template',
        subject: 'Welcome {{name}}',
        body: 'Hello {{name}}, welcome to LeadPilot AI'
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.template.name).toBe('Welcome Template');

    const previewRes = await request(app)
      .post('/api/email/preview')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subject: 'Hello {{name}}',
        body: 'Welcome {{name}}',
        variables: { name: 'Alice' }
      });

    expect(previewRes.statusCode).toBe(200);
    expect(previewRes.body.preview.subject).toBe('Hello Alice');
    expect(previewRes.body.preview.body).toBe('Welcome Alice');
  });
});
