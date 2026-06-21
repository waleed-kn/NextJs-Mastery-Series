'use client';

import React, { useState } from 'react';
import { Plus, Sliders } from 'lucide-react';

interface TaskInputProps {
  onQuickAdd: (title: string) => void;
  onOpenModal: () => void;
}

export default function TaskInput({ onQuickAdd, onOpenModal }: TaskInputProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onQuickAdd(title.trim());
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-2 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 flex items-center gap-2 animate-fade-in"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick add task title (press Enter)..."
          className="w-full rounded-xl border border-transparent bg-transparent py-2.5 px-3.5 text-sm text-foreground focus:outline-none"
          aria-label="Quick task title input"
        />
      </div>
      
      {/* Advanced Task Creation Toggle */}
      <button
        type="button"
        onClick={onOpenModal}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors cursor-pointer"
        title="Task details (Advanced options)"
        aria-label="Open detailed task creation form"
      >
        <Sliders className="h-4.5 w-4.5" />
      </button>

      {/* Quick Add Button */}
      <button
        type="submit"
        disabled={!title.trim()}
        className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label="Create task"
      >
        <Plus className="h-4.5 w-4.5" />
        <span className="hidden sm:inline">Add Task</span>
      </button>
    </form>
  );
}
