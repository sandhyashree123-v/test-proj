// QA Agent generated suite — traces to artifacts/design/test-planning/unit-test-cases-3.md
// Covers: UTC-21, UTC-22, UTC-23, UTC-29
process.env.DB_PATH = ':memory:';
const { resetConnectionForTests } = require('../../../server/src/db/database');
const { initializeDatabase } = require('../../../server/src/seed/seedDataLoader');
const skillsService = require('../../../server/src/services/skillsService');
const certificatesService = require('../../../server/src/services/certificatesService');
const { skills: seedSkills, certificates: seedCertificates } = require('../../../server/src/seed/seedData');

describe('seed loader — startup population (QA Agent suite)', () => {
  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  // UTC-21: Seed loader populates skills on startup
  test('UTC-21: running the startup seed routine against an empty datastore populates a catalog matching the seed dataset', () => {
    const result = skillsService.search({});

    expect(result.total).toBe(seedSkills.length);
    const seededIds = result.items.map((s) => s.id).sort();
    const expectedIds = seedSkills.map((s) => s.id).sort();
    expect(seededIds).toEqual(expectedIds);
  });

  // UTC-22: Seed data spans multiple categories and tags
  test('UTC-22: the seeded dataset spans at least 2 distinct categories and at least 2 distinct tags', () => {
    const categories = new Set(seedSkills.map((s) => s.category));
    const tags = new Set(seedSkills.flatMap((s) => s.tags));

    expect(categories.size).toBeGreaterThanOrEqual(2);
    expect(tags.size).toBeGreaterThanOrEqual(2);
  });

  // UTC-23: Each seeded skill has complete metadata
  test('UTC-23: every seeded skill record persisted by the startup loader has complete, non-empty required fields', () => {
    const result = skillsService.search({});

    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.owner).toBeTruthy();
      expect(item.status).toBeTruthy();

      const detail = skillsService.getById(item.id);
      expect(detail.version).toBeTruthy();
      expect(detail.lastUpdated).toBeTruthy();
      expect(detail.repoUrl).toBeTruthy();
      expect(detail.tags.length).toBeGreaterThan(0);
    });
  });

  // UTC-29: Certificate seed loader populates required fields on startup
  test('UTC-29: every seeded certificate has complete fields and references a real seeded skill', () => {
    const skillIds = new Set(seedSkills.map((s) => s.id));

    expect(seedCertificates.length).toBeGreaterThan(0);
    seedCertificates.forEach((cert) => {
      expect(cert.id).toBeTruthy();
      expect(cert.learnerName).toBeTruthy();
      expect(cert.completionDate).toBeTruthy();
      expect(cert.status).toBeTruthy();
      expect(skillIds.has(cert.skillId)).toBe(true);

      const verified = certificatesService.verify(cert.id);
      expect(verified).not.toBeNull();
      expect(verified.learnerName).toBe(cert.learnerName);
    });
  });
});
