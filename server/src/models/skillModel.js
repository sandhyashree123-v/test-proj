const VALID_STATUSES = ['Published', 'Deprecated', 'Archived'];

/**
 * Maps a skills row (joined with a comma-concatenated tags string) to the SkillSummary
 * shape used in catalog listings.
 */
function mapRowToSkillSummary(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    tags: row.tags ? row.tags.split(',') : [],
    owner: row.owner,
    status: row.status,
  };
}

/**
 * Maps a skills row (joined with a comma-concatenated tags string) to the full SkillDetail
 * shape used for the single-skill detail view.
 */
function mapRowToSkillDetail(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    tags: row.tags ? row.tags.split(',') : [],
    owner: row.owner,
    version: row.version,
    status: row.status,
    lastUpdated: row.last_updated,
    repoUrl: row.repo_url,
  };
}

module.exports = { VALID_STATUSES, mapRowToSkillSummary, mapRowToSkillDetail };
