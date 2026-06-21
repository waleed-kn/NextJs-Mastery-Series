'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import TaskItem from './TaskItem';
import { ClipboardList, Plus, ArrowRight, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  filteredAndSortedTasks: Task[];
  boardTasks: {
    todo: Task[];
    in_progress: Task[];
    completed: Task[];
  };
  viewMode: 'kanban' | 'list';
  totalFilteredCount: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onMoveStatus: (id: string, currentStatus: TaskStatus, direction: 'forward' | 'backward') => void;
  onAddTaskClick: () => void;
  onResetFiltersClick: () => void;
}

export default function TaskList({
  filteredAndSortedTasks,
  boardTasks,
  viewMode,
  totalFilteredCount,
  onEdit,
  onDelete,
  onStatusChange,
  onMoveStatus,
  onAddTaskClick,
  onResetFiltersClick,
}: TaskListProps) {
  return (
    <div className="w-full">
      {viewMode === 'kanban' ? (
        totalFilteredCount > 0 ? (
          // Kanban Board View
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Todo Column */}
            <div className="flex flex-col rounded-2xl bg-muted/30 p-4 border border-border/40 min-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-foreground">To Do</h2>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                  {boardTasks.todo.length}
                </span>
              </div>
              
              <div className="mt-4 flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {boardTasks.todo.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className="relative group/kanban"
                    >
                      <TaskItem
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                      <button
                        onClick={() => onMoveStatus(task.id, 'todo', 'forward')}
                        className="absolute top-1/2 -right-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-all opacity-0 group-hover/kanban:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none z-10 cursor-pointer"
                        title="Move to In Progress"
                        aria-label={`Move task to In Progress: ${task.title}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {boardTasks.todo.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground font-semibold">No tasks in Todo</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col rounded-2xl bg-muted/30 p-4 border border-border/40 min-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-foreground">In Progress</h2>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                  {boardTasks.in_progress.length}
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {boardTasks.in_progress.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className="relative group/kanban animate-fade-in"
                    >
                      <TaskItem
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                      <button
                        onClick={() => onMoveStatus(task.id, 'in_progress', 'backward')}
                        className="absolute top-1/2 -left-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black shadow-md hover:scale-105 transition-all opacity-0 group-hover/kanban:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none z-10 cursor-pointer"
                        title="Move back to Todo"
                        aria-label={`Move task back to Todo: ${task.title}`}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onMoveStatus(task.id, 'in_progress', 'forward')}
                        className="absolute top-1/2 -right-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-all opacity-0 group-hover/kanban:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none z-10 cursor-pointer"
                        title="Move to Completed"
                        aria-label={`Move task to Completed: ${task.title}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {boardTasks.in_progress.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground font-semibold">No tasks in Progress</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="flex flex-col rounded-2xl bg-muted/30 p-4 border border-border/40 min-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-foreground">Completed</h2>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                  {boardTasks.completed.length}
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {boardTasks.completed.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className="relative group/kanban animate-fade-in"
                    >
                      <TaskItem
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                      <button
                        onClick={() => onMoveStatus(task.id, 'completed', 'backward')}
                        className="absolute top-1/2 -left-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black shadow-md hover:scale-105 transition-all opacity-0 group-hover/kanban:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none z-10 cursor-pointer"
                        title="Move back to In Progress"
                        aria-label={`Move task back to In Progress: ${task.title}`}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {boardTasks.completed.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground font-semibold">No tasks completed</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Kanban View Empty State (Filtered results empty)
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center animate-fade-in max-w-md mx-auto shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-border bg-card text-amber-500">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">No matching tasks</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              No tasks match your active filters. Try clearing your search, category, or priority filters to see your tasks.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={onResetFiltersClick}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                Reset Filters
              </button>
              <button
                onClick={onAddTaskClick}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        )
      ) : (
        // List View
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredAndSortedTasks.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  >
                    <TaskItem
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            // List View Empty State (Filtered results empty)
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center animate-fade-in shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-border text-amber-500">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">No matching tasks</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                No tasks match your active filters. Try clearing your search, category, or priority filters to see your tasks.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={onResetFiltersClick}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Reset Filters
                </button>
                <button
                  onClick={onAddTaskClick}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
