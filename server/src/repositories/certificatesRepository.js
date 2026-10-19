const { getConnection } = require('../db/database');
const { mapRowToCertificateResult } = require('../models/certificateModel');

/**
 * Exact, case-sensitive lookup of a certificate by id, joined against skills to resolve the
 * completed item's display name. Returns null on no match — never throws for "not found".
 * This is a read-only join: it never writes to, or depends on, SkillsRepository.
 */
function findByCertificateId(certificateId) {
  const db = getConnection();
  const row = db
    .prepare(
      `
    SELECT c.id, c.learner_name, c.completion_date, c.status, sk.name as skill_name
    FROM certificates c
    JOIN skills sk ON sk.id = c.skill_id
    WHERE c.id = ?
  `
    )
    .get(certificateId);

  if (!row) {
    return null;
  }

  return mapRowToCertificateResult(row);
}

module.exports = { findByCertificateId };
