import { describe, it, expect, beforeEach } from 'vitest';
import db from '@/lib/db';
import { isOverdue } from '@/lib/overdue';

// Reset the throwaway test database's data before every test,
// so each test starts from a known, empty state.
beforeEach(() => {
  db.prepare('DELETE FROM tasks').run();
});

describe('task creation', () => {
  it('creates a task with the correct default status and archived flag', () => {
    db.prepare(`
      INSERT INTO tasks (title, description, due_date, topic)
      VALUES (?, ?, ?, ?)
    `).run('Test task', 'A description', '2026-08-01', 'Testing');

    const task = db.prepare('SELECT * FROM tasks WHERE title = ?').get('Test task');

    expect(task).toBeDefined();
    expect(task.status).toBe('todo');
    expect(task.archived).toBe(0);
  });
});

describe('archiving', () => {
  it('flags a task as archived without deleting it', () => {
    const result = db.prepare(`
      INSERT INTO tasks (title, topic) VALUES (?, ?)
    `).run('Task to archive', 'General');

    db.prepare('UPDATE tasks SET archived = 1 WHERE id = ?').run(result.lastInsertRowid);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    expect(task).toBeDefined();
    expect(task.archived).toBe(1);
  });
});

describe('overdue detection', () => {
  it('flags a task with a past due date and todo status as overdue', () => {
    const task = { due_date: '2020-01-01', status: 'todo', archived: 0 };
    expect(isOverdue(task)).toBe(true);
  });

  it('does not flag a completed task as overdue, even with a past due date', () => {
    const task = { due_date: '2020-01-01', status: 'complete', archived: 0 };
    expect(isOverdue(task)).toBe(false);
  });

  it('does not flag a task with a future due date as overdue', () => {
    const task = { due_date: '2099-01-01', status: 'todo', archived: 0 };
    expect(isOverdue(task)).toBe(false);
  });
});