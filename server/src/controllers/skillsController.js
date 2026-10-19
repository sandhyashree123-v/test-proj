const skillsService = require('../services/skillsService');

/** Parses and validates the optional `page` query param (positive integer, default 1). */
function parsePage(rawPage) {
  if (rawPage === undefined) {
    return { page: 1 };
  }
  const page = Number(rawPage);
  if (!Number.isInteger(page) || page < 1) {
    return { error: 'page must be a positive integer' };
  }
  return { page };
}

/** GET /api/skills — search/filter/paginate the catalog. */
function list(req, res) {
  const { q, category, tag, page: rawPage } = req.query;
  const { page, error } = parsePage(rawPage);

  if (error) {
    return res.status(400).json({ error });
  }

  const result = skillsService.search({ q, category, tag, page });
  return res.status(200).json(result);
}

/** GET /api/skills/:id — full detail for a single skill, or 404 if not found. */
function getById(req, res) {
  const { id } = req.params;
  const skill = skillsService.getById(id);

  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  return res.status(200).json(skill);
}

module.exports = { list, getById };
