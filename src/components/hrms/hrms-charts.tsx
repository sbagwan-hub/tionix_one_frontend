'use client';

import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { attendanceTrend, headcountByDepartment } from '@/constants/hrms-dashboard.constants';
import { hrmsCardClassName } from './hrms-styles';

const chartColors = {
  primary: 'var(--chart-2)',
  secondary: 'var(--chart-4)',
  grid: 'var(--border)',
  axis: 'var(--muted-foreground)',
  tooltipBg: 'var(--card)',
  tooltipBorder: 'var(--border)',
  tooltipText: 'var(--foreground)',
};

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className={hrmsCardClassName}>
      <div className="border-border border-b px-4 py-3">
        <h2 className="text-foreground text-sm font-semibold">{title}</h2>
        {description ? <p className="text-muted-foreground mt-0.5 text-xs">{description}</p> : null}
      </div>
      <div className="p-4 pt-2">{children}</div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-sm border px-3 py-2 text-xs"
      style={{
        backgroundColor: chartColors.tooltipBg,
        borderColor: chartColors.tooltipBorder,
        color: chartColors.tooltipText,
      }}
    >
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function HrmsAttendanceTrendChart() {
  return (
    <ChartPanel
      title="Attendance Trend"
      description="Daily present vs absent count for the last 7 days."
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...attendanceTrend]} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-muted-foreground text-xs capitalize">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="present"
              name="Present"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ r: 3, fill: chartColors.primary, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="absent"
              name="Absent"
              stroke={chartColors.secondary}
              strokeWidth={2}
              dot={{ r: 3, fill: chartColors.secondary, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

export function HrmsHeadcountChart() {
  return (
    <ChartPanel
      title="Headcount by Department"
      description="Active employee distribution across departments."
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[...headcountByDepartment]}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="department"
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={label !== undefined ? String(label) : undefined}
                  payload={
                    payload?.map((item) => ({
                      name: 'Employees',
                      value: Number(item.value),
                      color: chartColors.primary,
                    })) ?? []
                  }
                />
              )}
            />
            <Bar
              dataKey="employees"
              name="Employees"
              fill={chartColors.primary}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
