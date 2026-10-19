const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let dbInstance = null;

function resolveDbPath() {
  return process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'catalog.db');
}

function getConnection() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = resolveDbPath();

  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  dbInstance = new Database(dbPath);

  if (dbPath !== ':memory:') {
    dbInstance.pragma('journal_mode = WAL');
  }

  dbInstance.pragma('foreign_keys = ON');

  return dbInstance;
}

/**
 * Creates the skills/skill_tags/certificates tables if they do not already exist.
 * Safe to call on every startup — idempotent by construction (CREATE TABLE IF NOT EXISTS).
 */
function ensureSchema(db = getConnection()) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      description   TEXT NOT NULL,
      category      TEXT NOT NULL,
      owner         TEXT NOT NULL,
      version       TEXT NOT NULL,
      status        TEXT NOT NULL CHECK (status IN ('Published', 'Deprecated', 'Archived')),
      last_updated  TEXT NOT NULL,
      repo_url      TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skill_tags (
      skill_id TEXT NOT NULL REFERENCES skills(id),
      tag      TEXT NOT NULL,
      PRIMARY KEY (skill_id, tag)
    );

    CREATE INDEX IF NOT EXISTS idx_skill_tags_tag ON skill_tags(tag);

    CREATE TABLE IF NOT EXISTS certificates (
      id              TEXT PRIMARY KEY,
      learner_name    TEXT NOT NULL,
      skill_id        TEXT NOT NULL REFERENCES skills(id),
      completion_date TEXT NOT NULL,
      status          TEXT NOT NULL CHECK (status IN ('Valid', 'Revoked', 'Expired'))
    );

    CREATE INDEX IF NOT EXISTS idx_certificates_skill_id ON certificates(skill_id);
  `);

  return db;
}

/**
 * Test-only helper: closes and clears the cached connection so the next getConnection()
 * call opens a fresh database (used to isolate in-memory DBs between test cases).
 */
function resetConnectionForTests() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

module.exports = { getConnection, ensureSchema, resetConnectionForTests };
