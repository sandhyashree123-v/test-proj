process.env.DB_PATH = ':memory:';
const { resetConnectionForTests } = require('../src/db/database');
const { initializeDatabase } = require('../src/seed/seedDataLoader');

describe('seedDataLoader', () => {
  beforeEach(() => {
    resetConnectionForTests();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('seeds skills and certificates on first run', () => {
    const db = initializeDatabase();

    const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
    const certCount = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count;

    expect(skillCount).toBeGreaterThan(0);
    expect(certCount).toBeGreaterThan(0);
  });

  test('is idempotent across repeated calls (does not duplicate data)', () => {
    const db = initializeDatabase();
    const firstSkillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
    const firstCertCount = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count;

    initializeDatabase();

    const secondSkillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
    const secondCertCount = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count;

    expect(secondSkillCount).toBe(firstSkillCount);
    expect(secondCertCount).toBe(firstCertCount);
  });

  test('every seeded certificate references an existing skill (foreign key integrity)', () => {
    const db = initializeDatabase();

    const orphaned = db
      .prepare(
        `SELECT COUNT(*) as count FROM certificates c
         LEFT JOIN skills s ON s.id = c.skill_id
         WHERE s.id IS NULL`
      )
      .get().count;

    expect(orphaned).toBe(0);
  });

  test('seed data includes at least one certificate of each status', () => {
    const db = initializeDatabase();

    const statuses = db
      .prepare('SELECT DISTINCT status FROM certificates')
      .all()
      .map((row) => row.status);

    expect(statuses).toEqual(expect.arrayContaining(['Valid', 'Revoked', 'Expired']));
  });
});
