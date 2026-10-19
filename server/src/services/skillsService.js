const skillsRepository = require('../repositories/skillsRepository');

/** Treats a missing/blank/whitespace-only param as "not supplied". */
function normalizeParam(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Orchestrates catalog search/filter/pagination (US-1, US-3, US-4). All business logic
 * (matching, filter combination, sorting) lives in the repository's query construction;
 * this layer only normalizes input before delegating.
 */
function search({ q, category, tag, page } = {}) {
  return skillsRepository.findMany({
    q: normalizeParam(q),
    category: normalizeParam(category),
    tag: normalizeParam(tag),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  });
}

/** Orchestrates skill detail retrieval (US-2). Returns null if no skill matches. */
function getById(id) {
  if (!id) {
    return null;
  }
  return skillsRepository.findById(id);
}

module.exports = { search, getById };
