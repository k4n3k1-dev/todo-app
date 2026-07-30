import db from '@/lib/db';
import { NextResponse } from 'next/server';

const VALID_STATUSES = ['todo', 'in-progress', 'complete'];

// PATCH /api/tasks/:id — edit fields, change status, or archive a task
export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // Build the update using existing values as fallbacks,
  // so a caller can send just the one field they're changing.
  const updated = {
    title: body.title ?? existing.title,
    description: body.description ?? existing.description,
    due_date: body.due_date ?? existing.due_date,
    topic: body.topic ?? existing.topic,
    status: body.status ?? existing.status,
    archived: body.archived ?? existing.archived,
  };

  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, due_date = ?, topic = ?, status = ?, archived = ?
    WHERE id = ?
  `).run(
    updated.title,
    updated.description,
    updated.due_date,
    updated.topic,
    updated.status,
    updated.archived,
    id
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return NextResponse.json(task);
}