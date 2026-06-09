import { toast as baseToast } from 'sonner';
import { CheckCircle, AlertCircle, Info, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import React from 'react';

// Wrapper options
type ToastOptions = {
  description?: React.ReactNode;
  duration?: number;
};

// Base / default / custom toast
export const toast = (message: React.ReactNode | string, options?: ToastOptions) => {
  // If it's a direct React component, let sonner render it
  if (React.isValidElement(message)) {
    const { description, ...baseOptions } = options || {};
    return baseToast(message, baseOptions);
  }

  const { description, ...baseOptions } = options || {};

  // Render a custom layout by default
  return baseToast.custom(
    (id) => (
      <div className="bg-popover/95 border-border flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300">
        <div className="flex flex-1 flex-col">
          <span className="text-foreground text-sm font-medium">{message}</span>
          {description && <span className="text-muted-foreground mt-1 text-xs">{description}</span>}
        </div>
        <button
          onClick={() => baseToast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    ),
    baseOptions,
  );
};

// Success state
toast.success = (message: string, options?: ToastOptions) => {
  const { description, ...baseOptions } = options || {};
  return baseToast.custom(
    (id) => (
      <div className="bg-popover/95 flex w-full max-w-sm items-start gap-3 rounded-xl border border-emerald-500/30 p-4 shadow-lg backdrop-blur-md transition-all duration-300">
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <div className="flex flex-1 flex-col">
          <span className="text-foreground text-sm font-semibold">{message}</span>
          {description && <span className="text-muted-foreground mt-1 text-xs">{description}</span>}
        </div>
        <button
          onClick={() => baseToast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    ),
    baseOptions,
  );
};

// Error state
toast.error = (message: string, options?: ToastOptions) => {
  const { description, ...baseOptions } = options || {};
  return baseToast.custom(
    (id) => (
      <div className="bg-popover/95 border-destructive/30 flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300">
        <XCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
        <div className="flex flex-1 flex-col">
          <span className="text-foreground text-sm font-semibold">{message}</span>
          {description && <span className="text-muted-foreground mt-1 text-xs">{description}</span>}
        </div>
        <button
          onClick={() => baseToast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    ),
    baseOptions,
  );
};

// Info state
toast.info = (message: string, options?: ToastOptions) => {
  const { description, ...baseOptions } = options || {};
  return baseToast.custom(
    (id) => (
      <div className="bg-popover/95 flex w-full max-w-sm items-start gap-3 rounded-xl border border-blue-500/30 p-4 shadow-lg backdrop-blur-md transition-all duration-300">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div className="flex flex-1 flex-col">
          <span className="text-foreground text-sm font-semibold">{message}</span>
          {description && <span className="text-muted-foreground mt-1 text-xs">{description}</span>}
        </div>
        <button
          onClick={() => baseToast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    ),
    baseOptions,
  );
};

// Warning state
toast.warning = (message: string, options?: ToastOptions) => {
  const { description, ...baseOptions } = options || {};
  return baseToast.custom(
    (id) => (
      <div className="bg-popover/95 flex w-full max-w-sm items-start gap-3 rounded-xl border border-amber-500/30 p-4 shadow-lg backdrop-blur-md transition-all duration-300">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="flex flex-1 flex-col">
          <span className="text-foreground text-sm font-semibold">{message}</span>
          {description && <span className="text-muted-foreground mt-1 text-xs">{description}</span>}
        </div>
        <button
          onClick={() => baseToast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    ),
    baseOptions,
  );
};

// Loading state
toast.loading = (message: string, options?: ToastOptions) => {
  const { description, ...baseOptions } = options || {};
  return baseToast.custom(
    (id) => (
      <div className="bg-popover/95 border-border flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300">
        <Loader2 className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0 animate-spin" />
        <div className="flex flex-1 flex-col">
          <span className="text-foreground text-sm font-semibold">{message}</span>
          {description && <span className="text-muted-foreground mt-1 text-xs">{description}</span>}
        </div>
      </div>
    ),
    baseOptions,
  );
};

// Dismiss utilities
toast.dismiss = (id?: string | number) => baseToast.dismiss(id);
