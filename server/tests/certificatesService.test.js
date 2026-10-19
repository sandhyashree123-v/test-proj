process.env.DB_PATH = ':memory:';
const { resetConnectionForTests } = require('../src/db/database');
const { initializeDatabase } = require('../src/seed/seedDataLoader');
const { certificates } = require('../src/seed/seedData');
const certificatesService = require('../src/services/certificatesService');

describe('certificatesService', () => {
  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('verify returns full detail for a found certificate regardless of status', () => {
    const revoked = certificates.find((c) => c.status === 'Revoked');
    const result = certificatesService.verify(revoked.id);

    expect(result).not.toBeNull();
    expect(result.status).toBe('Revoked');
    expect(result.learnerName).toBe(revoked.learnerName);
  });

  test('verify returns null for an unknown certificate id', () => {
    expect(certificatesService.verify('CERT-2024-99999')).toBeNull();
  });
});
