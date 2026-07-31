'use client';

import { useState, useEffect, useCallback } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('due_date');
  const [showArchived, setShowArchived] = useState(false);

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?sortBy=${sortBy}`);
    const data = await res.json();
    setTasks(data);
  }, [sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function handleTaskCreated(newTask) {
    setTasks((prev) => [...prev, newTask]);
  }

  function handleTaskUpdated(updatedTask) {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }

  async function handleUnarchive(id) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: 0 }),
    });

    if (res.ok) {
      const updated = await res.json();
      handleTaskUpdated(updated);
    }
  }

  const archivedTasks = tasks.filter((t) => t.archived);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <TaskList
        tasks={tasks}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onTaskUpdated={handleTaskUpdated}
      />

      <div className="mt-8">
        <button
          onClick={() => setShowArchived((prev) => !prev)}
          className="text-sm text-gray-600 underline"
        >
          {showArchived ? 'Hide' : 'Show'} archived tasks ({archivedTasks.length})
        </button>

        {showArchived && (
          <ul className="mt-3 space-y-1">
            {archivedTasks.map((task) => (
              <li key={task.id} className="text-sm text-gray-300 flex items-center gap-2">
                <span>{task.title} — {task.topic} (archived)</span>
                <button
                  onClick={() => handleUnarchive(task.id)}
                  className="text-xs underline hover:text-white"
                >
                  Unarchive
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}