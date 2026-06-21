'use client';

import React from 'react';
import { TaskFilter, TaskPriority } from '@/types/task';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

interface FiltersProps {
  filter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  categories: string[];
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export default function Filters({
  filter,
  onChange,
  categories,
  viewMode,
  onViewModeChange,
}: FiltersProps) {
  
  const handleSearchChange = (val: string) => {
    onChange({ ...filter, search: val });
  };

  const handleCategoryChange = (val: string) => {
    onChange({ ...filter, category: val });
  };

  const handlePriorityChange = (val: string) => {
    onChange({ ...filter, priority: val as TaskPriority | 'all' });
  };

  const handleSortByChange = (val: string) => {
    onChange({ 
      ...filter, 
      sortBy: val as 'dueDate' | 'createdAt' | 'priority' | 'title' 
    });
  };

  const handleSortOrderChange = () => {
    onChange({ 
      ...filter, 
      sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  return (
    <div className="w-full space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      {/* Upper Row: Search & View Toggles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-11 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* View Toggles (Board vs List) */}
        <div className="flex h-10 items-center gap-1 rounded-xl bg-muted p-1 sm:self-end">
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Kanban Board View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="List View"
          >
            <List className="h-3.5 w-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex space-x-1 bg-muted/65 p-1 rounded-xl relative border border-border/20">
          {(['all', 'active', 'completed'] as const).map((tab) => {
            const isActive = filter.status === tab;
            const label = tab === 'all' ? 'All Tasks' : tab === 'active' ? 'Active' : 'Completed';
            return (
              <button
                key={tab}
                onClick={() => onChange({ ...filter, status: tab })}
                className={`relative px-4 py-1.5 text-xs font-bold transition-all duration-200 focus:outline-none rounded-lg cursor-pointer ${
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-border/60" />

      {/* Lower Row: Filter dropdowns */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:items-center">
        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            value={filter.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80" htmlFor="filter-priority">
            Priority
          </label>
          <select
            id="filter-priority"
            value={filter.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort Parameter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80" htmlFor="sort-by">
            Sort By
          </label>
          <select
            id="sort-by"
            value={filter.sortBy}
            onChange={(e) => handleSortByChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Date Created</option>
            <option value="priority">Priority Level</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Order
          </span>
          <button
            onClick={handleSortOrderChange}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{filter.sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
