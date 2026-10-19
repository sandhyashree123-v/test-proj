process.env.DB_PATH = ':memory:';
const request = require('supertest');
const { createApp } = require('../src/app');
const { resetConnectionForTests } = require('../src/db/database');
const { initializeDatabase } = require('../src/seed/seedDataLoader');

describe('Skills API', () => {
  let app;

  beforeEach(() => {
    resetConnectionForTests();
    initializeDatabase();
    app = createApp();
  });

  afterAll(() => {
    resetConnectionForTests();
  });

  test('GET /api/skills returns seeded skills', async () => {
    const response = await request(app).get('/api/skills');

    expect(response.status).toBe(200);
    expect(response.body.total).toBeGreaterThan(0);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  test('GET /api/skills?category=Engineering filters results', async () => {
    const response = await request(app).get('/api/skills').query({ category: 'Engineering' });

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);
    response.body.items.forEach((item) => {
      expect(item.category).toBe('Engineering');
    });
  });

  test('GET /api/skills?q=nonexistent-term returns an empty result set, not an error', async () => {
    const response = await request(app).get('/api/skills').query({ q: 'nonexistent-term-xyz' });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(0);
    expect(response.body.items).toEqual([]);
  });

  test('GET /api/skills?page=0 returns a validation error', async () => {
    const response = await request(app).get('/api/skills').query({ page: 0 });

    expect(response.status).toBe(400);
  });

  test('GET /api/skills/:id returns 404 for an unknown id', async () => {
    const response = await request(app).get('/api/skills/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Skill not found');
  });

  test('GET /api/skills/:id returns full detail for a known id', async () => {
    const list = await request(app).get('/api/skills');
    const firstId = list.body.items[0].id;

    const response = await request(app).get(`/api/skills/${firstId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(firstId);
    expect(response.body).toHaveProperty('repoUrl');
  });
});
