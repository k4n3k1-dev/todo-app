import Database from 'better-sqlite3';
import path from 'path';

// Use a separate database file when running tests, so tests never
// touch (or wipe) the real data the app uses during normal use.
const dbPath = process.env.NODE_ENV === 'test'
  ? path.join(process.cwd(), 'test.db')
  : path.join(process.cwd(), 'todo.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    topic TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;