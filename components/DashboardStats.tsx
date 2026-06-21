'use client';

import React from 'react';
import { TaskStats } from '@/types/task';
import { Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface DashboardStatsProps {
  stats: TaskStats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Layers,
      colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/30',
      description: 'Overall active tasks',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30',
      description: 'Currently working on',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30',
      description: `${completionRate}% task success rate`,
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      colorClass: stats.overdue > 0 
        ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 animate-pulse'
        : 'text-zinc-500 bg-zinc-50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800/30',
      description: 'Passed their due date',
    },
  ];

  return (
    <div className="w-full space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${item.colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {item.value}
                </span>
                <p className="mt-1 text-xs font-medium text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern custom progress bar for task completion */}
      {stats.total > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-foreground">Progress Completion</span>
            <span className="text-primary">{completionRate}%</span>
          </div>
          <div className="mt-3.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
