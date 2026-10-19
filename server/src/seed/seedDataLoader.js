const { getConnection, ensureSchema } = require('../db/database');
const { skills, certificates } = require('./seedData');

/** Seeds the fixed skill catalog only if the skills table is currently empty. */
function seedSkillsIfEmpty(db) {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (count > 0) {
    return;
  }

  const insertSkill = db.prepare(`
    INSERT INTO skills (id, name, description, category, owner, version, status, last_updated, repo_url)
    VALUES (@id, @name, @description, @category, @owner, @version, @status, @lastUpdated, @repoUrl)
  `);
  const insertTag = db.prepare('INSERT INTO skill_tags (skill_id, tag) VALUES (?, ?)');

  const insertAll = db.transaction((items) => {
    for (const skill of items) {
      insertSkill.run(skill);
      for (const tag of skill.tags) {
        insertTag.run(skill.id, tag);
      }
    }
  });

  insertAll(skills);
}

/**
 * Seeds demo certificates only if the certificates table is currently empty. Must run
 * after seedSkillsIfEmpty, since every certificate references an already-seeded skill by
 * foreign key.
 */
function seedCertificatesIfEmpty(db) {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM certificates').get();
  if (count > 0) {
    return;
  }

  const insertCertificate = db.prepare(`
    INSERT INTO certificates (id, learner_name, skill_id, completion_date, status)
    VALUES (@id, @learnerName, @skillId, @completionDate, @status)
  `);

  const insertAll = db.transaction((items) => {
    for (const certificate of items) {
      insertCertificate.run(certificate);
    }
  });

  insertAll(certificates);
}

/**
 * Runs once at process startup, before the HTTP listener binds: ensures the schema exists,
 * then seeds skills (if empty) followed by certificates (if empty). Idempotent across
 * restarts — safe to call on every server start.
 */
function initializeDatabase() {
  const db = getConnection();
  ensureSchema(db);
  seedSkillsIfEmpty(db);
  seedCertificatesIfEmpty(db);
  return db;
}

module.exports = { initializeDatabase, seedSkillsIfEmpty, seedCertificatesIfEmpty };
