import { cn } from '@/lib/utils';
import { hrmsStats } from '@/constants/hrms-dashboard.constants';
import { hrmsCardClassName } from './hrms-styles';

type HrmsStatCardsProps = {
  totalEmployees?: number;
};

export default function HrmsStatCards({ totalEmployees }: HrmsStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {hrmsStats.map((stat) => {
        const Icon = stat.icon;
        const value =
          stat.id === 'employees' && totalEmployees !== undefined
            ? String(totalEmployees)
            : stat.value;

        return (
          <div key={stat.id} className={cn(hrmsCardClassName, 'p-4')}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                  {stat.label}
                </p>
                <p className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">{stat.change}</p>
              </div>

              <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-sm">
                <Icon className="size-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HrmsStatusBadge({ status, className }: { status: string; className?: string }) {
  const normalized = status.toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex rounded-sm border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
        normalized === 'active' && 'border-border bg-muted text-foreground',
        normalized === 'probation' && 'border-border bg-secondary text-secondary-foreground',
        normalized === 'pending' && 'border-border bg-accent text-accent-foreground',
        normalized === 'approved' && 'border-border bg-muted text-foreground',
        className,
      )}
    >
      {status}
    </span>
  );
}
