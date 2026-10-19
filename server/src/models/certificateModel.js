const VALID_STATUSES = ['Valid', 'Revoked', 'Expired'];

/**
 * Maps a certificates row (joined with skills.name as skill_name) to the CertificateResult
 * shape returned by the verification API — status is passed through as-is, regardless of
 * value, per the "found record is found regardless of status" business rule.
 */
function mapRowToCertificateResult(row) {
  return {
    certificateId: row.id,
    learnerName: row.learner_name,
    skillName: row.skill_name,
    completionDate: row.completion_date,
    status: row.status,
  };
}

module.exports = { VALID_STATUSES, mapRowToCertificateResult };
