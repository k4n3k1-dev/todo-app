# Database Design

## Overview

The application uses a single SQLite database file (`todo.db`), containing one table: `tasks`. There are no relationships to other tables, as a single-user local todo app has no need for related entities such as users or categories as separate tables — topic is stored directly on the task as free text.

## Schema

| Column        | Type    | Constraints                          | Purpose                                      |
|---------------|---------|---------------------------------------|-----------------------------------------------|
| id            | INTEGER | PRIMARY KEY AUTOINCREMENT             | Unique identifier for each task              |
| title         | TEXT    | NOT NULL                              | Required task title                          |
| description   | TEXT    |                                        | Optional task description                    |
| due_date      | TEXT    |                                        | ISO date string (YYYY-MM-DD)                 |
| topic         | TEXT    |                                        | Free-text category/topic                     |
| status        | TEXT    | NOT NULL, DEFAULT 'todo'              | One of: todo, in-progress, complete           |
| archived      | INTEGER | NOT NULL, DEFAULT 0                   | 0 = active, 1 = archived                     |
| created_at    | TEXT    | NOT NULL, DEFAULT (datetime('now'))   | Timestamp of task creation                   |

## Key Design Decisions

- **Archiving is a flag, not deletion or relocation.** Setting `archived = 1` on a task keeps it in the same table and row, satisfying the brief's requirement that archived tasks "cannot be deleted, only archived, so that it remains viewable." No separate archive table exists.

- **Overdue status is derived, not stored.** There is no `overdue` column. A task is considered overdue at read time if all of the following are true: `archived = 0`, `status != 'complete'`, and `due_date` is earlier than the current date. This logic lives in `src/lib/overdue.js` and is shared by both the UI (`TaskList.js`) and the test suite, so the two can never disagree with each other.

- **Status is application-enforced, not database-enforced.** SQLite has no native enum type, so the three valid status values (`todo`, `in-progress`, `complete`) are validated in the API route (`src/app/api/tasks/[id]/route.js`) rather than as a database constraint.

---

*AI Declaration: The preceding document was reviewed and edited with: Claude-Web[Claude Sonnet 5]*