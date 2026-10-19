// QA Agent generated suite — traces to artifacts/design/test-planning/unit-test-cases-3.md
// Covers: UTC-01, UTC-02, UTC-03, UTC-05, UTC-06, UTC-07, UTC-08, UTC-09, UTC-10, UTC-11,
//         UTC-12, UTC-13, UTC-14, UTC-15, UTC-16, UTC-17, UTC-18, UTC-19
process.env.DB_PATH = ':memory:';
const {
  resetConnectionForTests,
  getConnection,
  ensureSchema,
} = require('../../../server/src/db/database');
const { initializeDatabase } = require('../../../server/src/seed/seedDataLoader');
const skillsService = require('../../../server/src/services/skillsService');
const { skills: seedSkills } = require('../../../server/src/seed/seedData');

describe('skillsService — catalog listing, detail, search, filters (QA Agent suite)', () => {
  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  // UTC-01: Catalog listing returns required card fields
  test('UTC-01: a returned skill card exposes name, description, category, tags, owner, and status matching the seed record', () => {
    const known = seedSkills.find((s) => s.id === 'skill-meeting-summarizer');
    const result = skillsService.search({});
    const card = result.items.find((item) => item.id === known.id);

    expect(card).toBeDefined();
    expect(card.name).toBe(known.name);
    expect(card.description).toBe(known.description);
    expect(card.category).toBe(known.category);
    expect(card.owner).toBe(known.owner);
    expect(card.status).toBe(known.status);
    expect([...card.tags].sort()).toEqual([...known.tags].sort());
  });

  // UTC-02: Catalog pagination returns correct subset
  // NOTE: the approved case's test data requests page=2 with pageSize=10 against a 25-skill
  // catalog, expecting exactly 10 items back. skillsService.search()/skillsRepository.findMany()
  // do not accept a pageSize parameter at all — PAGE_SIZE is hard-coded to 12 in
  // skillsRepository.js. This test is written to the approved case as specified; see the
  // report's Failures section for the resulting real-source-code finding.
  test('UTC-02: page=2 with pageSize=10 returns exactly 10 items (page 2 of a 25-skill catalog), with a total indicator present', () => {
    const db = getConnection();
    const insertSkill = db.prepare(`
      INSERT INTO skills (id, name, description, category, owner, version, status, last_updated, repo_url)
      VALUES (@id, @name, @description, @category, @owner, @version, @status, @lastUpdated, @repoUrl)
    `);
    for (let i = 0; i < 13; i += 1) {
      insertSkill.run({
        id: `qa-pagination-extra-${i}`,
        name: `QA Pagination Extra Skill ${String(i).padStart(2, '0')}`,
        description: 'Extra skill inserted purely to reach a 25-skill catalog for pagination testing.',
        category: 'QA Extra',
        owner: 'QA Agent',
        version: '1.0.0',
        status: 'Published',
        lastUpdated: '2026-01-01',
        repoUrl: 'https://example.com/qa-extra',
      });
    }

    const totalSkills = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
    expect(totalSkills).toBe(25);

    const page2 = skillsService.search({ page: 2, pageSize: 10 });

    expect(page2.total).toBe(25);
    expect(page2.items.length).toBe(10);
  });

  // UTC-03: Empty catalog returns empty-state indicator
  test('UTC-03: search against a completely empty catalog returns an empty items array, not null or a thrown error', () => {
    resetConnectionForTests();
    const db = getConnection();
    ensureSchema(db);

    let result;
    expect(() => {
      result = skillsService.search({});
    }).not.toThrow();

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  // UTC-05: Skill detail lookup by valid ID returns full metadata
  test('UTC-05: getById returns the full extended metadata set for an existing skill', () => {
    const known = seedSkills.find((s) => s.id === 'skill-meeting-summarizer');
    const detail = skillsService.getById(known.id);

    expect(detail).not.toBeNull();
    expect(detail.description).toBe(known.description);
    expect(detail.category).toBe(known.category);
    expect(detail.owner).toBe(known.owner);
    expect(detail.version).toBe(known.version);
    expect(detail.lastUpdated).toBe(known.lastUpdated);
    expect(detail.repoUrl).toBe(known.repoUrl);
    expect([...detail.tags].sort()).toEqual([...known.tags].sort());
  });

  // UTC-06: Skill detail lookup by non-existent ID returns not-found state
  test('UTC-06: getById returns null (a defined not-found result) for a non-existent id, without throwing', () => {
    expect(() => {
      const result = skillsService.getById('sk-99999-does-not-exist');
      expect(result).toBeNull();
    }).not.toThrow();
  });

  // UTC-07: Skill detail result includes catalog back-reference
  test('UTC-07: skill detail response includes its own id, usable for a return-to-catalog navigation action', () => {
    const known = seedSkills[0];
    const detail = skillsService.getById(known.id);

    expect(detail.id).toBe(known.id);
  });

  // UTC-08: Search matches on skill name
  test('UTC-08: keyword search matches against the skill name field', () => {
    const result = skillsService.search({ q: 'Summarizer' });
    const names = result.items.map((s) => s.name);

    expect(names).toContain('Smart Meeting Summarizer');
    expect(names).not.toContain('Sales Forecast Predictor');
  });

  // UTC-09: Search matches on skill description
  test('UTC-09: keyword search matches against the skill description field', () => {
    const result = skillsService.search({ q: 'action items' });
    const ids = result.items.map((s) => s.id);

    expect(ids).toContain('skill-meeting-summarizer');
  });

  // UTC-10: Search matches on skill tags
  test('UTC-10: keyword search matches against the skill tags array', () => {
    const result = skillsService.search({ q: 'summarization' });
    const ids = result.items.map((s) => s.id);

    expect(ids).toContain('skill-meeting-summarizer');
    expect(ids.length).toBe(1);
  });

  // UTC-11: Search with no matches returns empty-results state
  // NOTE: at this service layer, the "zero skills exist" case (UTC-03) and the "no search
  // matches" case return the identical {items: [], total: 0} shape — there is no separate
  // flag here. The distinct empty-state variant described in the approved case (zero-catalog
  // vs. no-results) is implemented one layer up, in the client's CatalogPage (emptyVariant =
  // hasActiveFilters ? 'no-results' : 'zero-catalog') — see Test Quality Notes in the report.
  test('UTC-11: a non-matching search query returns an empty result list, not an error', () => {
    const result = skillsService.search({ q: 'zzzznomatchzzzz' });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  // UTC-12: Clearing search restores prior catalog view
  test('UTC-12: clearing an applied search query and re-invoking listing returns the full catalog again', () => {
    const filtered = skillsService.search({ q: 'Summarizer' });
    expect(filtered.total).toBeLessThan(seedSkills.length);

    const cleared = skillsService.search({ q: '' });
    expect(cleared.total).toBe(seedSkills.length);
  });

  // UTC-13: Search term casing and whitespace handling (flagged ambiguous in REQ-03;
  // this documents the ACTUAL observed behavior rather than asserting a mandated rule).
  test('UTC-13: a search query with surrounding whitespace and different casing still matches (documents actual behavior)', () => {
    const result = skillsService.search({ q: '  SUMMARIZER  ' });
    const ids = result.items.map((s) => s.id);

    expect(ids).toContain('skill-meeting-summarizer');
  });

  // UTC-14: Filter by category returns only matching skills
  test('UTC-14: filtering by category returns only skills in that exact category', () => {
    const result = skillsService.search({ category: 'Productivity' });

    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.category).toBe('Productivity');
    });
  });

  // UTC-15: Filter by tag returns only matching skills
  test('UTC-15: filtering by tag returns only skills whose tags array includes that tag', () => {
    const result = skillsService.search({ tag: 'nlp' });

    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.tags).toContain('nlp');
    });
  });

  // UTC-16: Combined category and tag filter returns intersection
  test('UTC-16: combined category and tag filters return only skills matching both (AND semantics)', () => {
    const result = skillsService.search({ category: 'Customer Support', tag: 'nlp' });

    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.category).toBe('Customer Support');
      expect(item.tags).toContain('nlp');
    });
  });

  // UTC-17: Combined filter and search returns matching intersection
  test('UTC-17: an active category filter combined with a search term returns only the intersection', () => {
    const result = skillsService.search({ category: 'Productivity', q: 'Triage' });

    expect(result.items.length).toBe(1);
    expect(result.items[0].id).toBe('skill-inbox-triage');
  });

  // UTC-18: Filter/search combination with no matches returns empty-result state
  test('UTC-18: a filter/search combination with no matching skills returns an empty result set', () => {
    const result = skillsService.search({ category: 'Engineering', q: 'Triage' });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  // UTC-19: Clearing filters restores unfiltered catalog
  test('UTC-19: clearing active category and tag filters restores the full catalog', () => {
    const filtered = skillsService.search({ category: 'Engineering', tag: 'ml' });
    expect(filtered.total).toBeLessThan(seedSkills.length);

    const cleared = skillsService.search({ category: undefined, tag: undefined });
    expect(cleared.total).toBe(seedSkills.length);
  });
});
