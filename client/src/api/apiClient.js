const BASE_URL = '/api';

/**
 * Shared response handling. When `nullOn404` is set, a 404 resolves to `null` instead of
 * throwing — used for both getSkillById and verifyCertificate, which share a
 * "return the real thing or return null" not-found contract with the backend.
 */
async function handleResponse(response, { nullOn404 = false } = {}) {
  if (response.status === 404 && nullOn404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/** GET /api/skills — keyword search + category/tag filter + pagination. */
async function listSkills({ q, category, tag, page } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  if (page) params.set('page', String(page));

  const query = params.toString();
  const response = await fetch(`${BASE_URL}/skills${query ? `?${query}` : ''}`);
  return handleResponse(response);
}

/** GET /api/skills/:id — returns full detail, or null if not found. */
async function getSkillById(id) {
  const response = await fetch(`${BASE_URL}/skills/${encodeURIComponent(id)}`);
  return handleResponse(response, { nullOn404: true });
}

/** GET /api/certificates/:certificateId — returns full detail, or null if not found. */
async function verifyCertificate(certificateId) {
  const response = await fetch(`${BASE_URL}/certificates/${encodeURIComponent(certificateId)}`);
  return handleResponse(response, { nullOn404: true });
}

export { listSkills, getSkillById, verifyCertificate };
