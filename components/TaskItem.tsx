'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Calendar, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityConfig = {
  high: {
    label: 'High',
    dotClass: 'bg-rose-500',
    badgeClass: 'bg-rose-50/70 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/30',
  },
  medium: {
    label: 'Medium',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-50/70 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30',
  },
  low: {
    label: 'Low',
    dotClass: 'bg-sky-500',
    badgeClass: 'bg-sky-50/70 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-300 dark:border-sky-900/30',
  },
};

const defaultCategoryColors: Record<string, string> = {
  work: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/30',
  personal: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30',
  development: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/30',
  design: 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-900/30',
  marketing: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30',
};

function getCategoryColor(category: string): string {
  const norm = category.trim().toLowerCase();
  if (defaultCategoryColors[norm]) return defaultCategoryColors[norm];
  
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = norm.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/30',
    'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-300 dark:border-teal-900/30',
    'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/20 dark:text-cyan-300 dark:border-cyan-900/30',
    'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/20 dark:text-violet-300 dark:border-violet-900/30',
    'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/30',
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const isCompleted = task.completed;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = 
    !isCompleted && 
    task.dueDate && 
    new Date(task.dueDate + 'T23:59:59') < today;

  const priority = priorityConfig[task.priority] || priorityConfig.low;
  const categoryColor = getCategoryColor(task.category);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggleStatus = () => {
    const nextStatus = isCompleted ? 'todo' : 'completed';
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div 
      className={`group relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 focus-within:ring-2 focus-within:ring-primary/25 ${
        isCompleted ? 'opacity-60 dark:opacity-50' : ''
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {/* Category */}
            <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${categoryColor}`}>
              {task.category}
            </span>

            {/* Priority */}
            <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-semibold ${priority.badgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${priority.dotClass}`} aria-hidden="true" />
              {priority.label}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all cursor-pointer"
              title="Edit Task"
              aria-label={`Edit task: ${task.title}`}
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-600 dark:focus:hover:text-rose-400 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none transition-all cursor-pointer"
              title="Delete Task"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Task Title & Details */}
        <div className="mt-4 flex items-start gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleStatus}
            role="checkbox"
            aria-checked={isCompleted}
            className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary focus:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg p-0.5 transition-all cursor-pointer"
            aria-label={isCompleted ? `Mark task incomplete: ${task.title}` : `Mark task completed: ${task.title}`}
          >
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <CheckCircle2 className="h-5 w-5 text-indigo-500 fill-indigo-500/10 dark:text-indigo-400" />
              </motion.div>
            ) : (
              <Circle className="h-5 w-5 hover:scale-105 transition-transform" />
            )}
          </motion.button>
          <div className="space-y-1">
            <h3 className="relative font-medium text-sm sm:text-base tracking-tight leading-snug inline-block">
              <span className={`transition-all duration-300 ${isCompleted ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                {task.title}
              </span>
              {isCompleted && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute left-0 top-[50%] h-[1.5px] bg-muted-foreground/60"
                  aria-hidden="true"
                />
              )}
            </h3>
            {task.description && (
              <p className={`text-xs leading-relaxed line-clamp-3 transition-colors duration-300 ${
                isCompleted ? 'text-muted-foreground/40 line-through' : 'text-muted-foreground'
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Due Date */}
      {task.dueDate && (
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-1.5">
            <Calendar className={`h-3.5 w-3.5 ${isOverdue ? 'text-rose-500' : 'text-muted-foreground'}`} aria-hidden="true" />
            <span className={`text-[11px] font-semibold ${
              isOverdue 
                ? 'text-rose-600 dark:text-rose-400 animate-pulse' 
                : 'text-muted-foreground'
            }`}>
              {formatDate(task.dueDate)} {isOverdue && '(Overdue)'}
            </span>
          </div>

          {/* Quick status progress select button */}
          {!isCompleted && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="rounded-lg border border-border/80 bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors cursor-pointer"
              aria-label={`Change status for: ${task.title}`}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Complete</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}
