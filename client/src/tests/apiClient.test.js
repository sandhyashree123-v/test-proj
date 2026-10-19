import { describe, expect, test, vi, afterEach } from 'vitest';
import { listSkills, getSkillById, verifyCertificate } from '../api/apiClient';

function mockFetchOnce(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('listSkills builds query params and returns the parsed response', async () => {
    mockFetchOnce(200, { items: [], total: 0, page: 1, pageSize: 12 });

    const result = await listSkills({ q: 'test', category: 'Engineering', page: 2 });

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/skills?'));
    expect(result.total).toBe(0);
  });

  test('getSkillById returns null on 404', async () => {
    mockFetchOnce(404, { error: 'Skill not found' });

    const result = await getSkillById('missing');

    expect(result).toBeNull();
  });

  test('verifyCertificate returns null on 404 and throws on other error statuses', async () => {
    mockFetchOnce(404, { error: 'Certificate not found' });
    const notFound = await verifyCertificate('CERT-2024-99999');
    expect(notFound).toBeNull();

    mockFetchOnce(400, { error: 'certificateId is required' });
    await expect(verifyCertificate('')).rejects.toThrow('certificateId is required');
  });
});
