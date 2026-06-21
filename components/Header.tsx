'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { Sun, Moon, Plus, CheckSquare, Cloud, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onAddTaskClick: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

export default function Header({ onAddTaskClick, saveStatus }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">
              AeroTask
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Dashboard
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Auto-save Status Indicator */}
          <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground border border-border/40 min-h-10">
            <AnimatePresence mode="wait">
              {saveStatus === 'saving' && (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span className="hidden xs:inline">Saving...</span>
                </motion.div>
              )}
              {saveStatus === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium animate-pulse"
                >
                  <Check className="h-4 w-4" />
                  <span className="hidden xs:inline">Saved</span>
                </motion.div>
              )}
              {saveStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="flex items-center gap-1.5 text-muted-foreground font-semibold"
                >
                  <Cloud className="h-4 w-4" />
                  <span className="hidden xs:inline">Synced</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-[18px] w-[18px] text-zinc-600 transition-transform hover:rotate-12" />
            ) : (
              <Sun className="h-[18px] w-[18px] text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>

          {/* Add Task Button */}
          <button
            onClick={onAddTaskClick}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
