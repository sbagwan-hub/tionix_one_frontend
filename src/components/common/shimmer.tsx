import * as React from 'react';
import { cn } from '@/lib/utils';

type ShimmerVariant = 'text' | 'rect' | 'circle';

export interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ShimmerVariant;
  count?: number;
  containerClassName?: string;
}

const variantClasses: Record<ShimmerVariant, string> = {
  circle: 'rounded-full h-12 w-12 shrink-0',
  rect: 'rounded-lg w-full h-24',
  text: 'h-3.5 rounded-md',
};

function getItemClasses(variant: ShimmerVariant, index: number, count: number): string {
  if (variant !== 'text') return variantClasses[variant];
  const isShortLast = index === count - 1 && count > 1;
  return cn(variantClasses.text, isShortLast ? 'w-[72%]' : 'w-full');
}

export const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  ({ variant = 'rect', count = 1, className, containerClassName, ...props }, ref) => {
    const items = React.useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
    const useWrapper = count > 1 || variant === 'text';

    const block = (index: number) => (
      <div
        key={index}
        className={cn(
          'animate-shimmer bg-muted/60 shrink-0',
          getItemClasses(variant, index, count),
          className,
        )}
        aria-hidden="true"
        {...(index === 0 ? props : {})}
      />
    );

    if (useWrapper) {
      return (
        <div
          ref={ref}
          role="status"
          aria-label="Loading…"
          className={cn('flex w-full flex-col gap-2.5', containerClassName)}
        >
          {items.map((i) => block(i))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading…"
        className={cn(
          'animate-shimmer bg-muted/60 shrink-0',
          getItemClasses(variant, 0, 1),
          className,
        )}
        {...props}
      />
    );
  },
);

Shimmer.displayName = 'Shimmer';

export default Shimmer;
