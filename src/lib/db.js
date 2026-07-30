import Database from 'better-sqlite3';
import path from 'path';

// The database file will live at the project root as todo.db
const dbPath = path.join(process.cwd(), 'todo.db');

const db = new Database(dbPath);

// Create the tasks table if it doesn't already exist.
// This runs every time the app starts, but CREATE TABLE IF NOT EXISTS
// makes it safe to run repeatedly without wiping existing data.
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