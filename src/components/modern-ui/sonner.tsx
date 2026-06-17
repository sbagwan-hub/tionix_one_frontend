import { toast as baseToast } from 'sonner';
import { CheckCircle2, AlertOctagon, Info, AlertTriangle, Loader2, X } from 'lucide-react';
import React from 'react';

// Wrapper options
type ToastOptions = {
  description?: React.ReactNode;
  duration?: number;
  id?: string | number;
};

// Base close button component
const CloseButton = ({ id }: { id: string | number }) => (
  <button
    onClick={() => baseToast.dismiss(id)}
    className="text-muted-foreground/50 hover:text-foreground hover:bg-muted/80 shrink-0 rounded-md p-1 transition-all duration-150"
    aria-label="Close toast"
  >
    <X className="h-3.5 w-3.5" />
  </button>
);

// Base / default / custom toast
export const toast = (message: React.ReactNode | string, options?: ToastOptions) => {
  if (React.isValidElement(message)) {
    const { description, ...baseOptions } = options || {};
    return baseToast(message, baseOptions);
  }

  const { description, ...baseOptions } = options || {};

  return baseToast.custom(
    (id) => (
      <div className="bg-popover border-border/60 flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-md transition-all duration-200 hover:shadow-lg">
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-foreground text-xs leading-snug font-medium tracking-tight">
            {message}
          </span>
          {description && (
            <span className="text-muted-foreground/80 mt-0.5 text-[11px] leading-relaxed">
              {description}
            </span>
          )}
        </div>
        <CloseButton id={id} />
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
      <div className="bg-popover border-border/60 flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-md transition-all duration-200 hover:shadow-lg">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-foreground text-xs leading-snug font-semibold tracking-tight">
            {message}
          </span>
          {description && (
            <span className="text-muted-foreground/80 mt-0.5 text-[11px] leading-relaxed">
              {description}
            </span>
          )}
        </div>
        <CloseButton id={id} />
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
      <div className="bg-popover border-border/60 flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-md transition-all duration-200 hover:shadow-lg">
        <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-foreground text-xs leading-snug font-semibold tracking-tight">
            {message}
          </span>
          {description && (
            <span className="text-muted-foreground/80 mt-0.5 text-[11px] leading-relaxed">
              {description}
            </span>
          )}
        </div>
        <CloseButton id={id} />
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
      <div className="bg-popover border-border/60 flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-md transition-all duration-200 hover:shadow-lg">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-foreground text-xs leading-snug font-semibold tracking-tight">
            {message}
          </span>
          {description && (
            <span className="text-muted-foreground/80 mt-0.5 text-[11px] leading-relaxed">
              {description}
            </span>
          )}
        </div>
        <CloseButton id={id} />
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
      <div className="bg-popover border-border/60 flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-md transition-all duration-200 hover:shadow-lg">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-foreground text-xs leading-snug font-semibold tracking-tight">
            {message}
          </span>
          {description && (
            <span className="text-muted-foreground/80 mt-0.5 text-[11px] leading-relaxed">
              {description}
            </span>
          )}
        </div>
        <CloseButton id={id} />
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
      <div className="bg-popover border-border/60 flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-md">
        <Loader2 className="text-primary mt-0.5 h-4 w-4 shrink-0 animate-spin" />
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-foreground text-xs leading-snug font-semibold tracking-tight">
            {message}
          </span>
          {description && (
            <span className="text-muted-foreground/80 mt-0.5 text-[11px] leading-relaxed">
              {description}
            </span>
          )}
        </div>
      </div>
    ),
    baseOptions,
  );
};

// Dismiss utilities
toast.dismiss = (id?: string | number) => baseToast.dismiss(id);
