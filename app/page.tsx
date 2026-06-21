'use client';

import React, { useState, useMemo } from 'react';
import { useTasks } from '@/lib/useTasks';
import { Task, TaskFilter, TaskStatus } from '@/types/task';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import TaskInput from '@/components/TaskInput';
import Filters from '@/components/Filters';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';
import { ClipboardList, Plus } from 'lucide-react';

export default function Home() {
  const {
    tasks,
    categories,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    saveStatus,
  } = useTasks();

  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0,
      overdue: 0,
    };

    tasks.forEach((t) => {
      if (t.status === 'todo') result.todo++;
      if (t.status === 'in_progress') result.inProgress++;
      if (t.completed) result.completed++;
      if (t.priority === 'high') result.highPriority++;
      
      const isOverdue = 
        !t.completed && 
        t.dueDate && 
        new Date(t.dueDate + 'T23:59:59') < today;
        
      if (isOverdue) result.overdue++;
    });

    return result;
  }, [tasks]);

  // Handle task filtering & sorting
  const filteredAndSortedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((t) => {
        // Search filter
        const matchSearch =
          t.title.toLowerCase().includes(filter.search.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(filter.search.toLowerCase()));

        // Status filter
        let matchStatus = true;
        if (viewMode === 'list') {
          if (filter.status === 'active') {
            matchStatus = !t.completed;
          } else if (filter.status === 'completed') {
            matchStatus = t.completed;
          } else if (filter.status !== 'all') {
            matchStatus = t.status === filter.status;
          }
        }

        // Priority filter
        const matchPriority = filter.priority === 'all' || t.priority === filter.priority;

        // Category filter
        const matchCategory = filter.category === 'all' || t.category === filter.category;

        return matchSearch && matchStatus && matchPriority && matchCategory;
      })
      .sort((a, b) => {
        let valA: any = a[filter.sortBy];
        let valB: any = b[filter.sortBy];

        // Custom sort for priority weight (high > medium > low)
        if (filter.sortBy === 'priority') {
          const weights = { high: 3, medium: 2, low: 1 };
          valA = weights[a.priority];
          valB = weights[b.priority];
        }

        // Keep undefined values (like optional due dates) at the bottom
        if (filter.sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
        }

        if (valA < valB) return filter.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return filter.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tasks, filter, viewMode]);

  // Modal handlers
  const handleOpenAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  // Split tasks by status for Kanban Board
  const boardTasks = useMemo(() => {
    return {
      todo: filteredAndSortedTasks.filter((t) => t.status === 'todo'),
      in_progress: filteredAndSortedTasks.filter((t) => t.status === 'in_progress'),
      completed: filteredAndSortedTasks.filter((t) => t.status === 'completed'),
    };
  }, [filteredAndSortedTasks]);

  const handleMoveStatus = (id: string, currentStatus: TaskStatus, direction: 'forward' | 'backward') => {
    const statuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];
    const idx = statuses.indexOf(currentStatus);
    const targetIdx = direction === 'forward' ? idx + 1 : idx - 1;
    
    if (targetIdx >= 0 && targetIdx < statuses.length) {
      updateTask(id, { status: statuses[targetIdx] });
    }
  };

  const handleResetFilters = () => {
    setFilter({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });
  };

  const handleQuickAddTask = (title: string) => {
    addTask({
      title,
      description: '',
      status: 'todo',
      priority: 'medium',
      completed: false,
      category: categories[0] || 'Work',
    });
  };

  const totalFilteredCount = useMemo(() => {
    return boardTasks.todo.length + boardTasks.in_progress.length + boardTasks.completed.length;
  }, [boardTasks]);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-12 transition-colors duration-300">
      {/* Header */}
      <Header onAddTaskClick={handleOpenAddTask} saveStatus={saveStatus} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {!isLoaded ? (
          // Rich Skeleton Shimmer Loader
          <div className="space-y-8">
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="shimmer-wrapper border border-border bg-card rounded-2xl p-5 h-28" />
              ))}
            </div>
            
            {/* Completion rate bar skeleton */}
            <div className="shimmer-wrapper border border-border bg-card rounded-2xl p-5 h-20" />

            {/* Filter skeleton */}
            <div className="shimmer-wrapper border border-border bg-card rounded-2xl p-5 h-28" />

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="shimmer-wrapper border border-border bg-card rounded-2xl p-5 h-96" />
              ))}
            </div>
          </div>
        ) : (
          // Loaded Dashboard View
          <>
            {/* Statistics */}
            <DashboardStats stats={stats} />

            {/* Quick Task Input Bar */}
            <div className="pt-2">
              <TaskInput onQuickAdd={handleQuickAddTask} onOpenModal={handleOpenAddTask} />
            </div>

            {tasks.length === 0 ? (
              // Workspace Empty State (No tasks at all)
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-16 text-center animate-fade-in max-w-2xl mx-auto shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-primary">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">No tasks yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Welcome to AeroTask! Create your first task to plan your workday, track progress, and accomplish your goals.
                </p>
                <button
                  onClick={handleOpenAddTask}
                  className="mt-8 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Task</span>
                </button>
              </div>
            ) : (
              <>
                {/* Filters */}
                <Filters
                  filter={filter}
                  onChange={setFilter}
                  categories={categories}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />

                {/* Dashboard Task Content */}
                <TaskList
                  filteredAndSortedTasks={filteredAndSortedTasks}
                  boardTasks={boardTasks}
                  viewMode={viewMode}
                  totalFilteredCount={totalFilteredCount}
                  onEdit={handleOpenEditTask}
                  onDelete={deleteTask}
                  onStatusChange={(id, stat) => updateTask(id, { status: stat })}
                  onMoveStatus={handleMoveStatus}
                  onAddTaskClick={handleOpenAddTask}
                  onResetFiltersClick={handleResetFilters}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Task Modal Container */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
      />
    </div>
  );
}
