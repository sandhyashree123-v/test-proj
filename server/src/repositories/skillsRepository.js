const { getConnection } = require('../db/database');
const { mapRowToSkillSummary, mapRowToSkillDetail } = require('../models/skillModel');

const PAGE_SIZE = 12;

/**
 * Builds the shared WHERE clause + params for both the count and page queries, so filtering
 * logic never drifts between the two.
 */
function buildWhereClause({ q, category, tag }) {
  const clauses = [];
  const params = {};

  if (category) {
    clauses.push('LOWER(s.category) = LOWER(@category)');
    params.category = category;
  }

  if (tag) {
    clauses.push(
      'EXISTS (SELECT 1 FROM skill_tags st_f WHERE st_f.skill_id = s.id AND LOWER(st_f.tag) = LOWER(@tag))'
    );
    params.tag = tag;
  }

  if (q) {
    clauses.push(`(
      LOWER(s.name) LIKE @q
      OR LOWER(s.description) LIKE @q
      OR EXISTS (SELECT 1 FROM skill_tags st_q WHERE st_q.skill_id = s.id AND LOWER(st_q.tag) LIKE @q)
    )`);
    params.q = `%${q.toLowerCase()}%`;
  }

  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return { whereSql, params };
}

/**
 * Keyword search + category/tag AND-filtering + pagination, sorted alphabetically (A-Z) by
 * name. Category/tag matching is case-insensitive exact match; keyword matching is a
 * case-insensitive substring match across name, description, and tags.
 */
function findMany({ q, category, tag, page = 1 } = {}) {
  const db = getConnection();
  const { whereSql, params } = buildWhereClause({ q, category, tag });

  const totalRow = db.prepare(`SELECT COUNT(*) as count FROM skills s ${whereSql}`).get(params);
  const total = totalRow.count;

  const offset = (page - 1) * PAGE_SIZE;
  const rows = db
    .prepare(
      `
    SELECT s.*, (
      SELECT GROUP_CONCAT(tag, ',') FROM skill_tags WHERE skill_id = s.id
    ) as tags
    FROM skills s
    ${whereSql}
    ORDER BY s.name COLLATE NOCASE ASC
    LIMIT @limit OFFSET @offset
  `
    )
    .all({ ...params, limit: PAGE_SIZE, offset });

  return {
    items: rows.map(mapRowToSkillSummary),
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}

/** Returns the full SkillDetail for an id, or null if no skill matches. */
function findById(id) {
  const db = getConnection();
  const row = db
    .prepare(
      `
    SELECT s.*, (
      SELECT GROUP_CONCAT(tag, ',') FROM skill_tags WHERE skill_id = s.id
    ) as tags
    FROM skills s
    WHERE s.id = ?
  `
    )
    .get(id);

  if (!row) {
    return null;
  }

  return mapRowToSkillDetail(row);
}

module.exports = { findMany, findById, PAGE_SIZE };
