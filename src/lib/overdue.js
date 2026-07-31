export function isOverdue(task) {
  if (task.archived || task.status === 'complete' || !task.due_date) return false;
  const today = new Date().toISOString().split('T')[0];
  return task.due_date < today;
}