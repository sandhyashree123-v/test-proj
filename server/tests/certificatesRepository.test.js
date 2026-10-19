process.env.DB_PATH = ':memory:';
const { getConnection, ensureSchema, resetConnectionForTests } = require('../src/db/database');
const certificatesRepository = require('../src/repositories/certificatesRepository');

function seedSkillAndCertificate(db) {
  db.prepare(
    `INSERT INTO skills (id, name, description, category, owner, version, status, last_updated, repo_url)
     VALUES ('skill-x', 'Skill X', 'Desc', 'Engineering', 'Team', '1.0', 'Published', '2026-01-01', 'https://example.com')`
  ).run();

  db.prepare(
    `INSERT INTO certificates (id, learner_name, skill_id, completion_date, status)
     VALUES ('CERT-X', 'Jane Doe', 'skill-x', '2026-01-01', 'Valid')`
  ).run();
}

describe('certificatesRepository', () => {
  beforeEach(() => {
    resetConnectionForTests();
    const db = getConnection();
    ensureSchema(db);
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('findByCertificateId resolves the skill name via join', () => {
    const db = getConnection();
    seedSkillAndCertificate(db);

    const result = certificatesRepository.findByCertificateId('CERT-X');

    expect(result).not.toBeNull();
    expect(result.skillName).toBe('Skill X');
    expect(result.learnerName).toBe('Jane Doe');
    expect(result.status).toBe('Valid');
  });

  test('findByCertificateId is case-sensitive and exact (no fuzzy/substring matching)', () => {
    const db = getConnection();
    seedSkillAndCertificate(db);

    expect(certificatesRepository.findByCertificateId('cert-x')).toBeNull();
    expect(certificatesRepository.findByCertificateId('CERT-X-EXTRA')).toBeNull();
    expect(certificatesRepository.findByCertificateId('CERT')).toBeNull();
  });

  test('findByCertificateId returns null for an unknown id', () => {
    expect(certificatesRepository.findByCertificateId('UNKNOWN')).toBeNull();
  });

  test('a revoked certificate is still a valid "found" result at the data layer', () => {
    const db = getConnection();
    db.prepare(
      `INSERT INTO skills (id, name, description, category, owner, version, status, last_updated, repo_url)
       VALUES ('skill-y', 'Skill Y', 'Desc', 'Engineering', 'Team', '1.0', 'Published', '2026-01-01', 'https://example.com')`
    ).run();
    db.prepare(
      `INSERT INTO certificates (id, learner_name, skill_id, completion_date, status)
       VALUES ('CERT-Y', 'John Smith', 'skill-y', '2026-01-01', 'Revoked')`
    ).run();

    const result = certificatesRepository.findByCertificateId('CERT-Y');

    expect(result).not.toBeNull();
    expect(result.status).toBe('Revoked');
  });
});
