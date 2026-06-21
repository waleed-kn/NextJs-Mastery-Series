'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';

// Key for localStorage
const LOCAL_STORAGE_KEY = 'antigravity_task_manager_tasks';

// Custom default categories
export const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Development', 'Design', 'Marketing'];

// Helper to get today's date formatted as YYYY-MM-DD
const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design Dashboard Layout',
    description: 'Create a clean, responsive card-based layout with vibrant, harmonized color palettes for categories and priorities. Apply glassmorphism styling and custom animations.',
    status: 'in_progress',
    completed: false,
    priority: 'high',
    dueDate: getTodayString(0),
    category: 'Design',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement LocalStorage State Management',
    description: 'Implement safe loading/saving of tasks to localStorage with hydration error prevention in Next.js.',
    status: 'completed',
    completed: true,
    priority: 'high',
    dueDate: getTodayString(-1),
    category: 'Development',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Refactor Task Filters & Search',
    description: 'Add dynamic filter controls for categories, priority levels, status tabs, search inputs, and due-date sorting options.',
    status: 'todo',
    completed: false,
    priority: 'medium',
    dueDate: getTodayString(1),
    category: 'Development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Schedule User Review Session',
    description: 'Review the completed dashboard designs and interactive Kanban board with the project manager.',
    status: 'todo',
    completed: false,
    priority: 'low',
    dueDate: getTodayString(3),
    category: 'Marketing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load initial tasks from localStorage safely after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        } else {
          throw new Error('Parsed tasks is not an array');
        }
      } else {
        // First load: seed with default tasks and save
        setTasks(DEFAULT_TASKS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      }
    } catch (e) {
      console.error('Error reading tasks from localStorage, resetting to default:', e);
      setTasks(DEFAULT_TASKS);
    }

    try {
      const storedCats = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cats`);
      if (storedCats) {
        const parsedCats = JSON.parse(storedCats);
        if (Array.isArray(parsedCats)) {
          setCategories(parsedCats);
        } else {
          throw new Error('Parsed categories is not an array');
        }
      }
    } catch (e) {
      console.error('Error reading categories from localStorage, resetting to default:', e);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever tasks change, but only after loaded
  useEffect(() => {
    if (!isLoaded) return;
    try {
      setSaveStatus('saving');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      const timer = setTimeout(() => setSaveStatus('saved'), 600);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Error saving to localStorage', e);
      setSaveStatus('idle');
    }
  }, [tasks, isLoaded]);

  // Save categories to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_cats`, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to localStorage', e);
    }
  }, [categories, isLoaded]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    // Add category dynamically if it's new (preventing stale state references)
    if (taskData.category) {
      setCategories((prev) => prev.includes(taskData.category) ? prev : [...prev, taskData.category]);
    }
  };

  const updateTask = (id: string, updatedFields: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updatedFields };
          // Sync completed and status
          if (updatedFields.status !== undefined && updatedFields.completed === undefined) {
            merged.completed = updatedFields.status === 'completed';
          } else if (updatedFields.completed !== undefined && updatedFields.status === undefined) {
            merged.status = updatedFields.completed ? 'completed' : (t.status === 'completed' ? 'todo' : t.status);
          }
          return {
            ...merged,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    const category = updatedFields.category;
    if (category) {
      setCategories((prev) => prev.includes(category) ? prev : [...prev, category]);
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = (category: string) => {
    const trimmed = category.trim();
    if (trimmed) {
      setCategories((prev) => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    }
  };

  return {
    tasks,
    categories,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    saveStatus,
  };
}
