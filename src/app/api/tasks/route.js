import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/tasks — returns all tasks, with optional sorting
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sortBy'); // 'topic' | 'status' | 'due_date'

  const validSortColumns = ['topic', 'status', 'due_date'];
  const orderBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';

  const tasks = db.prepare(`SELECT * FROM tasks ORDER BY ${orderBy} ASC`).all();

  return NextResponse.json(tasks);
}

// POST /api/tasks — creates a new task
export async function POST(request) {
  const body = await request.json();
  const { title, description, due_date, topic } = body;

  if (!title || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (?, ?, ?, ?)
  `).run(title, description || null, due_date || null, topic || null);

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  return NextResponse.json(newTask, { status: 201 });
}