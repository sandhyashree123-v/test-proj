process.env.DB_PATH = ':memory:';
const { resetConnectionForTests } = require('../src/db/database');
const { initializeDatabase } = require('../src/seed/seedDataLoader');
const skillsService = require('../src/services/skillsService');

describe('skillsService', () => {
  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('search returns seeded results sorted alphabetically', () => {
    const result = skillsService.search({});
    const names = result.items.map((s) => s.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sorted);
    expect(result.pageSize).toBe(12);
  });

  test('search treats whitespace-only filters as "not supplied"', () => {
    const result = skillsService.search({ category: '   ', tag: '' });
    expect(result.total).toBeGreaterThan(0);
  });

  test('search falls back to page 1 for an invalid page value', () => {
    const result = skillsService.search({ page: -5 });
    expect(result.page).toBe(1);
  });

  test('getById returns null for an unknown id and a missing id', () => {
    expect(skillsService.getById('nope')).toBeNull();
    expect(skillsService.getById(undefined)).toBeNull();
  });
});
