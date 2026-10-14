const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'projects.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    stack TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK(status IN ('planning','in-progress','completed')),
    github_url TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
