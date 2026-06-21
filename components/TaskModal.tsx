'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { X, Calendar, FolderPlus, FileText } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    completed: boolean;
    dueDate?: string;
    category: string;
  }) => void;
  task?: Task; // If provided, we are in edit mode
  categories: string[];
}

export default function TaskModal({ isOpen, onClose, onSave, task, categories }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({});

  // Reset/populate form when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate || '');
        
        const isDefaultCat = categories.includes(task.category);
        if (isDefaultCat) {
          setCategory(task.category);
          setShowCustomCategory(false);
        } else {
          setCategory('custom');
          setCustomCategory(task.category);
          setShowCustomCategory(true);
        }
      } else {
        // Defaults for new task
        setTitle('');
        setDescription('');
        setStatus('todo');
        setPriority('medium');
        setDueDate('');
        setCategory(categories[0] || 'Work');
        setCustomCategory('');
        setShowCustomCategory(false);
      }
      setErrors({});
    }
  }, [isOpen, task, categories]);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; category?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    }

    const finalCategory = showCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      newErrors.category = 'Please select or enter a category.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      completed: status === 'completed',
      dueDate: dueDate || undefined,
      category: finalCategory,
    });
    
    onClose();
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (val === 'custom') {
      setShowCustomCategory(true);
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg transform overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl transition-all animate-fade-in sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <h2 id="modal-title" className="text-xl font-bold tracking-tight text-foreground">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="task-title">
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design homepage hero section"
              className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.title ? 'border-rose-500 focus:border-rose-500' : 'border-border focus:border-primary'
              }`}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-rose-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="task-description">
              Description
            </label>
            <div className="relative">
              <textarea
                id="task-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your task in details..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Grid: Category & Due Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="task-category">
                Category
              </label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="custom">+ New Category</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="task-duedate">
                Due Date
              </label>
              <div className="relative">
                <input
                  id="task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Custom Category Input */}
          {showCustomCategory && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="custom-category">
                New Category Name *
              </label>
              <input
                id="custom-category"
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Health, Finance"
                className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.category ? 'border-rose-500 focus:border-rose-500' : 'border-border focus:border-primary'
                }`}
              />
              {errors.category && (
                <p className="text-xs font-semibold text-rose-500">{errors.category}</p>
              )}
            </div>
          )}

          {/* Priority selection - Radio Cards */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Priority
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                let activeStyle = '';
                
                if (p === 'low') {
                  activeStyle = isSelected 
                    ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400 dark:border-sky-500/40' 
                    : 'hover:bg-muted border-border';
                } else if (p === 'medium') {
                  activeStyle = isSelected 
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:border-amber-500/40' 
                    : 'hover:bg-muted border-border';
                } else {
                  activeStyle = isSelected 
                    ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 dark:border-rose-500/40' 
                    : 'hover:bg-muted border-border';
                }

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-sm font-semibold capitalize transition-all duration-200 ${activeStyle}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* If editing, show status select */}
          {task && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-border/80 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted focus:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all cursor-pointer"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
