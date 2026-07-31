'use client';

import { useState } from 'react';
import { isOverdue } from '@/lib/overdue';

const STATUSES = ['todo', 'in-progress', 'complete'];

export default function TaskList({ tasks, sortBy, onSortChange, onTaskUpdated }) {
  const [editingId, setEditingId] = useState(null);

  async function updateTask(id, changes) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });

    if (res.ok) {
      const updated = await res.json();
      onTaskUpdated(updated);
    }
  }

  function handleSort(column) {
    onSortChange(column);
  }

  const activeTasks = tasks.filter((t) => !t.archived);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="p-2 cursor-pointer" onClick={() => handleSort('topic')}>
            Topic {sortBy === 'topic' && '↓'}
          </th>
          <th className="p-2">Title</th>
          <th className="p-2">Description</th>
          <th className="p-2 cursor-pointer" onClick={() => handleSort('due_date')}>
            Due Date {sortBy === 'due_date' && '↓'}
          </th>
          <th className="p-2 cursor-pointer" onClick={() => handleSort('status')}>
            Status {sortBy === 'status' && '↓'}
          </th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {activeTasks.map((task) => (
          <tr
            key={task.id}
            className={`border-b ${isOverdue(task) ? 'bg-red-100 text-black' : ''}`}
          >
            <td className="p-2">{task.topic}</td>
            <td className="p-2">{task.title}</td>
            <td className="p-2">{task.description}</td>
            <td className="p-2">
              {task.due_date}
              {isOverdue(task) && (
                <span className="ml-2 text-red-600 text-xs font-semibold">OVERDUE</span>
              )}
            </td>
            <td className="p-2">
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value })}
                className="border rounded px-2 py-1 bg-white text-black"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </td>
            <td className="p-2">
              <button
                onClick={() => updateTask(task.id, { archived: 1 })}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Archive
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}