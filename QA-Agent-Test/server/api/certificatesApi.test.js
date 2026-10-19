// QA Agent generated suite — traces to artifacts/design/test-planning/unit-test-cases-3.md
// Covers: UTC-24, UTC-25, UTC-26, UTC-27, UTC-28, UTC-30
process.env.DB_PATH = ':memory:';
// NOTE: this file lives outside code/v2/server's own directory tree (it's a sibling under
// QA-Agent-Test), so Node's ancestor-only module resolution for a bare `require('supertest')`
// never reaches code/v2/server/node_modules. Requiring it via a direct relative path works
// around that (test-executability fix only; no application/source code touched).
const request = require('../../../server/node_modules/supertest');
const { createApp } = require('../../../server/src/app');
const { resetConnectionForTests } = require('../../../server/src/db/database');
const { initializeDatabase } = require('../../../server/src/seed/seedDataLoader');
const { certificates: seedCertificates } = require('../../../server/src/seed/seedData');

describe('Certificates API — verification (QA Agent suite)', () => {
  let app;

  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
    app = createApp();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  // UTC-24: Certificate lookup with matching ID returns full confirmation details
  test('UTC-24: GET /api/certificates/:id returns full confirmation details for a matching Valid certificate', async () => {
    const valid = seedCertificates.find((c) => c.status === 'Valid');

    const response = await request(app).get(`/api/certificates/${valid.id}`);

    expect(response.status).toBe(200);
    expect(response.body.learnerName).toBe(valid.learnerName);
    expect(response.body.completionDate).toBe(valid.completionDate);
    expect(response.body.status).toBe('Valid');
    expect(response.body.skillName).toBeTruthy();
  });

  // UTC-25: Revoked certificate still returns full detail, not generic message
  test('UTC-25: GET /api/certificates/:id returns full detail (not a not-found message) for a Revoked certificate', async () => {
    const revoked = seedCertificates.find((c) => c.status === 'Revoked');

    const response = await request(app).get(`/api/certificates/${revoked.id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Revoked');
    expect(response.body.learnerName).toBe(revoked.learnerName);
    expect(response.body.error).toBeUndefined();
  });

  // UTC-26: Expired certificate still returns full detail, not generic message
  test('UTC-26: GET /api/certificates/:id returns full detail (not a not-found message) for an Expired certificate', async () => {
    const expired = seedCertificates.find((c) => c.status === 'Expired');

    const response = await request(app).get(`/api/certificates/${expired.id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Expired');
    expect(response.body.error).toBeUndefined();
  });

  // UTC-27: Non-matching certificate ID returns single generic not-found message
  test('UTC-27: GET /api/certificates/:id returns a single generic not-found message for a non-matching ID', async () => {
    const response = await request(app).get('/api/certificates/CERT-0000-00000');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Certificate not found' });
  });

  // UTC-28: Empty or malformed certificate ID submission (flagged ambiguous in REQ-06;
  // this documents actual observed behavior rather than asserting a mandated rule).
  test('UTC-28: a blank certificate ID segment and a malformed certificate ID are each handled without a server crash (documents actual behavior)', async () => {
    const blankResponse = await request(app).get('/api/certificates/%20');
    expect(blankResponse.status).toBe(400);
    expect(blankResponse.body.error).toBe('certificateId is required');

    const malformedResponse = await request(app).get(`/api/certificates/${encodeURIComponent('!!!###')}`);
    expect(malformedResponse.status).toBe(404);
    expect(malformedResponse.body.error).toBe('Certificate not found');
  });

  // UTC-30: Certificate verification function requires no authentication context
  test('UTC-30: certificate verification succeeds with no authentication/session context provided', async () => {
    const valid = seedCertificates.find((c) => c.status === 'Valid');

    const response = await request(app).get(`/api/certificates/${valid.id}`).set('Authorization', '');

    expect(response.status).toBe(200);
    expect(response.body.certificateId).toBe(valid.id);
  });
});
