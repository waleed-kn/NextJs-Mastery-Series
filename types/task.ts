export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string; // Format: YYYY-MM-DD
  category: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface TaskFilter {
  search: string;
  status: 'all' | 'active' | 'completed' | TaskStatus;
  priority: TaskPriority | 'all';
  category: string; // 'all' or specific category
  sortBy: 'dueDate' | 'createdAt' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  highPriority: number;
  overdue: number;
}
