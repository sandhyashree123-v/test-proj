process.env.DB_PATH = ':memory:';
const { getConnection, ensureSchema, resetConnectionForTests } = require('../src/db/database');
const skillsRepository = require('../src/repositories/skillsRepository');

function seedSkill(db, overrides = {}) {
  const skill = {
    id: 'skill-test-1',
    name: 'Test Skill',
    description: 'A skill for testing',
    category: 'Engineering',
    owner: 'QA Team',
    version: '1.0.0',
    status: 'Published',
    lastUpdated: '2026-01-01',
    repoUrl: 'https://example.com/repo',
    tags: ['testing', 'automation'],
    ...overrides,
  };

  db.prepare(
    `INSERT INTO skills (id, name, description, category, owner, version, status, last_updated, repo_url)
     VALUES (@id, @name, @description, @category, @owner, @version, @status, @lastUpdated, @repoUrl)`
  ).run(skill);

  const insertTag = db.prepare('INSERT INTO skill_tags (skill_id, tag) VALUES (?, ?)');
  skill.tags.forEach((tag) => insertTag.run(skill.id, tag));

  return skill;
}

describe('skillsRepository', () => {
  beforeEach(() => {
    resetConnectionForTests();
    const db = getConnection();
    ensureSchema(db);
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('findMany returns seeded skills sorted alphabetically by name', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-b', name: 'Beta Skill' });
    seedSkill(db, { id: 'skill-a', name: 'Alpha Skill', tags: ['nlp'] });

    const result = skillsRepository.findMany({ page: 1 });

    expect(result.total).toBe(2);
    expect(result.items.map((s) => s.name)).toEqual(['Alpha Skill', 'Beta Skill']);
  });

  test('findMany filters by category (case-insensitive exact match)', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-eng', category: 'Engineering' });
    seedSkill(db, { id: 'skill-prod', category: 'Productivity', name: 'Prod Skill' });

    const result = skillsRepository.findMany({ category: 'productivity' });

    expect(result.total).toBe(1);
    expect(result.items[0].category).toBe('Productivity');
  });

  test('findMany filters by tag', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-tagged', tags: ['special-tag'] });
    seedSkill(db, { id: 'skill-other', name: 'Other Skill', tags: ['other-tag'] });

    const result = skillsRepository.findMany({ tag: 'special-tag' });

    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('skill-tagged');
  });

  test('findMany matches keyword across name, description, and tags', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-kw', description: 'Handles unique-phrase processing' });
    seedSkill(db, { id: 'skill-other', name: 'Other Skill' });

    const result = skillsRepository.findMany({ q: 'unique-phrase' });

    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('skill-kw');
  });

  test('findMany combines category and tag filters with AND', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-match', category: 'Engineering', tags: ['testing'] });
    seedSkill(db, { id: 'skill-wrong-tag', category: 'Engineering', tags: ['other'] });
    seedSkill(db, { id: 'skill-wrong-category', category: 'Productivity', tags: ['testing'] });

    const result = skillsRepository.findMany({ category: 'Engineering', tag: 'testing' });

    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('skill-match');
  });

  test('findMany returns empty items/total for no matches', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-1' });

    const result = skillsRepository.findMany({ q: 'nonexistent-term' });

    expect(result.total).toBe(0);
    expect(result.items).toEqual([]);
  });

  test('findById returns full detail for a known id, null for unknown', () => {
    const db = getConnection();
    seedSkill(db, { id: 'skill-detail' });

    const found = skillsRepository.findById('skill-detail');
    expect(found).not.toBeNull();
    expect(found.id).toBe('skill-detail');

    expect(skillsRepository.findById('does-not-exist')).toBeNull();
  });
});
