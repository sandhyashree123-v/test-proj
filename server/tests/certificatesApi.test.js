process.env.DB_PATH = ':memory:';
const request = require('supertest');
const { createApp } = require('../src/app');
const { resetConnectionForTests } = require('../src/db/database');
const { initializeDatabase } = require('../src/seed/seedDataLoader');
const { certificates } = require('../src/seed/seedData');

describe('Certificates API', () => {
  let app;

  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
    app = createApp();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('returns full detail for a valid certificate', async () => {
    const seeded = certificates.find((c) => c.status === 'Valid');

    const response = await request(app).get(`/api/certificates/${seeded.id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Valid');
    expect(response.body.learnerName).toBe(seeded.learnerName);
    expect(response.body).toHaveProperty('skillName');
  });

  test('returns full detail for a revoked certificate (not treated as not-found)', async () => {
    const seeded = certificates.find((c) => c.status === 'Revoked');

    const response = await request(app).get(`/api/certificates/${seeded.id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Revoked');
  });

  test('returns full detail for an expired certificate (not treated as not-found)', async () => {
    const seeded = certificates.find((c) => c.status === 'Expired');

    const response = await request(app).get(`/api/certificates/${seeded.id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Expired');
  });

  test('returns 404 with a single generic message for an unknown certificate id', async () => {
    const response = await request(app).get('/api/certificates/CERT-2024-99999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Certificate not found');
  });

  test('returns 400 for a blank certificate id', async () => {
    const response = await request(app).get('/api/certificates/%20%20');

    expect(response.status).toBe(400);
  });

  test('returns 400 for a certificate id exceeding the maximum length', async () => {
    const tooLong = 'A'.repeat(101);

    const response = await request(app).get(`/api/certificates/${tooLong}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('certificateId exceeds maximum length');
  });

  test('does not require any authentication', async () => {
    const seeded = certificates[0];

    const response = await request(app)
      .get(`/api/certificates/${seeded.id}`)
      .set('Authorization', '');

    expect(response.status).toBe(200);
  });
});
