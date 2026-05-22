'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  RefreshCw,
  Undo,
  Save,
  Printer,
  FileOutput,
  HelpCircle,
  LogOut,
  Edit3,
  Trash2,
} from 'lucide-react';

export default function Toolbar() {
  return (
    <div className="ring-border/50 dark:border-input/60 dark:bg-card mb-2 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-slate-200/80 bg-white p-3">
      <div className="dark:border-input/60 flex items-center gap-1 border-r border-slate-200 pr-4">
        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="First"
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="Next"
        >
          <ChevronRight size={18} />
        </button>

        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="Last"
        >
          <ChevronsRight size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <button className="bg-brand flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-600">
          <Plus size={16} />
          Add New
        </button>

        <button className="dark:border-input/60 dark:text-foreground dark:hover:bg-accent flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Edit3 size={16} />
          Edit
        </button>

        <button className="flex items-center gap-1.5 rounded-sm border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">
          <Trash2 size={16} />
          Delete
        </button>

        <div className="dark:bg-border mx-1 h-6 w-px bg-slate-200" />

        <button className="dark:border-input/60 dark:text-foreground dark:hover:bg-accent flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Undo size={16} />
          Undo
        </button>

        <button className="flex items-center gap-1.5 rounded-sm bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700">
          <Save size={16} />
          Save
        </button>

        <button className="dark:border-input/60 dark:text-foreground dark:hover:bg-accent flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Utility */}
      <div className="dark:border-input/60 flex items-center gap-2 border-l border-slate-200 pl-4">
        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="Print List"
        >
          <Printer size={18} />
        </button>

        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="Export Data"
        >
          <FileOutput size={18} />
        </button>

        <button
          className="dark:text-muted-foreground dark:hover:bg-accent rounded-sm p-2 text-slate-500 transition hover:bg-slate-100"
          title="Help"
        >
          <HelpCircle size={18} />
        </button>

        <button
          className="ml-2 rounded-sm p-2 text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          title="Exit Form"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
