'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Plus, X, Calendar, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HrmsStatusBadge } from '@/components/hrms/hrms-stat-cards';
import {
  hrmsButtonClassName,
  hrmsCardClassName,
  hrmsInputClassName,
  hrmsPageClassName,
  hrmsControlRadiusClassName,
  hrmsNestedCardClassName,
} from '@/components/hrms/hrms-styles';
import { leaveRequests as initialLeaveRequests } from '@/constants/hrms-dashboard.constants';

type LeaveRequest = {
  id: string;
  employee: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: string;
  remarks?: string;
};

type LeaveBalance = {
  employee: string;
  annualUsed: number;
  annualTotal: number;
  sickUsed: number;
  sickTotal: number;
  casualUsed: number;
  casualTotal: number;
};

const initialLeaveBalances: LeaveBalance[] = [
  {
    employee: 'James Wilson',
    annualUsed: 13,
    annualTotal: 25,
    sickUsed: 2,
    sickTotal: 10,
    casualUsed: 3,
    casualTotal: 7,
  },
  {
    employee: 'Fatima Hassan',
    annualUsed: 10,
    annualTotal: 25,
    sickUsed: 1,
    sickTotal: 10,
    casualUsed: 1,
    casualTotal: 7,
  },
  {
    employee: 'David Chen',
    annualUsed: 5,
    annualTotal: 25,
    sickUsed: 0,
    sickTotal: 10,
    casualUsed: 2,
    casualTotal: 7,
  },
  {
    employee: 'Emily Brown',
    annualUsed: 7,
    annualTotal: 25,
    sickUsed: 3,
    sickTotal: 10,
    casualUsed: 4,
    casualTotal: 7,
  },
];

export default function LeaveManagementPage() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<LeaveRequest[]>(() =>
    initialLeaveRequests.map((r) => ({ ...r, remarks: '' })),
  );
  const [balances, setBalances] = useState<LeaveBalance[]>(() => [...initialLeaveBalances]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Remarks states
  const [remarksInput, setRemarksInput] = useState<Record<string, string>>({});

  // Search/Filter states
  const [search, setSearch] = useState('');

  // Calendar states (defaulting to May 2026)
  const currentMonthDays = 31;
  const currentMonthName = 'May 2026';

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRequests = localStorage.getItem('hrms_leave_requests');
      const savedBalances = localStorage.getItem('hrms_leave_balances');
      if (savedRequests) {
        try {
          setRequests(JSON.parse(savedRequests));
        } catch (e) {
          console.error(e);
        }
      }
      if (savedBalances) {
        try {
          setBalances(JSON.parse(savedBalances));
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('hrms_leave_requests', JSON.stringify(requests));
      localStorage.setItem('hrms_leave_balances', JSON.stringify(balances));
    }
  }, [requests, balances, isLoaded]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.employee.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [requests, search]);



  const handleUpdateStatus = (id: string, nextStatus: 'Approved' | 'Rejected') => {
    const remark = remarksInput[id] || '';
    setRequests((curr) =>
      curr.map((r) => (r.id === id ? { ...r, status: nextStatus, remarks: remark } : r)),
    );
  };

  // Helper to determine who is on leave on a specific day of May 2026
  const getLeavesForDay = (day: number) => {
    const activeLeaves: { name: string; type: string }[] = [];

    requests.forEach((r) => {
      if (r.status !== 'Approved') return;

      const fromDate = new Date(r.from);
      const toDate = new Date(r.to);

      if (fromDate.getFullYear() === 2026 && fromDate.getMonth() === 4) {
        const startDay = fromDate.getDate();
        const endDay = toDate.getDate();

        if (day >= startDay && day <= endDay) {
          activeLeaves.push({ name: r.employee, type: r.type });
        }
      }
    });

    return activeLeaves;
  };

  return (
    <div className={`${hrmsPageClassName} py-4 pb-6 font-sans px-4`}>
      <div className={`flex flex-col gap-4 ${hrmsControlRadiusClassName}`}>
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link href="/hrms/dashboard">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ArrowLeft className="size-4 mr-1" />
                  Back
                </Button>
              </Link>
              <h1 className="text-foreground text-xl font-semibold">Leave & Attendance Hub</h1>
            </div>
            <p className="text-muted-foreground text-xs pl-10">
              Review, approve, track leave balances, and review team schedules.
            </p>
          </div>
        </div>

        {/* Live Leave Balance Tracker */}
        <div className={hrmsCardClassName}>
          <div className="border-border border-b px-4 py-3 flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h2 className="text-foreground text-sm font-semibold">Live Leave Balance Directory</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            {balances.map((b) => (
              <div key={b.employee} className={`${hrmsNestedCardClassName} p-3 flex flex-col gap-2`}>
                <div className="flex items-center justify-between border-b border-border pb-1">
                  <span className="text-foreground text-xs font-semibold">{b.employee}</span>
                  <User className="size-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Leave</span>
                    <span className="text-foreground font-medium">
                      {b.annualTotal - b.annualUsed} / {b.annualTotal} Left
                    </span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${((b.annualTotal - b.annualUsed) / b.annualTotal) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Sick Leave</span>
                    <span className="text-foreground font-medium">
                      {b.sickTotal - b.sickUsed} / {b.sickTotal} Left
                    </span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${((b.sickTotal - b.sickUsed) / b.sickTotal) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Casual Leave</span>
                    <span className="text-foreground font-medium">
                      {b.casualTotal - b.casualUsed} / {b.casualTotal} Left
                    </span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${((b.casualTotal - b.casualUsed) / b.casualTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Input */}
        <div className={`${hrmsCardClassName} p-4`}>
          <Label
            htmlFor="leave-search"
            className="text-muted-foreground block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
          >
            Search Leave Requests
          </Label>
          <Input
            id="leave-search"
            className={hrmsInputClassName}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee, leave type, status..."
          />
        </div>

        {/* Leave Table with Remarks and Quick Actions */}
        <div className={hrmsCardClassName}>
          <div className="border-border border-b px-4 py-3">
            <h2 className="text-foreground text-sm font-semibold">Leave Applications & Actions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full border-separate border-spacing-0 text-left">
              <TableHeader>
                <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
                  <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    ID / Employee
                  </TableHead>
                  <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    Leave Type
                  </TableHead>
                  <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    Duration Period
                  </TableHead>
                  <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Total Days
                  </TableHead>
                  <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    Manager Remarks
                  </TableHead>
                  <TableHead className="text-muted-foreground w-[220px] min-w-[220px] p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Review Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-border divide-y">
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground p-8 text-center text-sm">
                      No leave applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="p-4">
                        <div className="flex flex-col">
                          <span className="text-foreground text-sm font-medium">{request.employee}</span>
                          <span className="text-muted-foreground text-xs">{request.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground p-4 text-sm">{request.type}</TableCell>
                      <TableCell className="text-muted-foreground p-4 text-sm">
                        {request.from} - {request.to}
                      </TableCell>
                      <TableCell className="text-foreground p-4 text-center text-sm">{request.days}</TableCell>
                      <TableCell className="p-4 text-center">
                        <HrmsStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="p-4 text-sm max-w-[200px] truncate">
                        {request.status === 'Pending' ? (
                          <Input
                            placeholder="Add decision remarks..."
                            className="h-7 text-xs bg-background border border-input rounded-sm"
                            value={remarksInput[request.id] || ''}
                            onChange={(e) =>
                              setRemarksInput({ ...remarksInput, [request.id]: e.target.value })
                            }
                          />
                        ) : (
                          <span className="text-foreground text-xs">{request.remarks || '—'}</span>
                        )}
                      </TableCell>
                      <TableCell className="w-[220px] min-w-[220px] p-4">
                        <div className="flex items-center justify-center gap-2">
                          {request.status === 'Pending' ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 rounded-sm border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs px-2.5 flex items-center gap-1"
                                onClick={() => handleUpdateStatus(request.id, 'Approved')}
                              >
                                <Check className="size-3.5" />
                                Approve
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 rounded-sm border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs px-2.5 flex items-center gap-1"
                                onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                              >
                                <X className="size-3.5" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Reviewed</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Team Leave Calendar */}
        <div className={hrmsCardClassName}>
          <div className="border-border border-b px-4 py-3 flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <h2 className="text-foreground text-sm font-semibold">Team Schedule Tracker ({currentMonthName})</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {/* Day headers */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
                <div key={dayName} className="text-muted-foreground text-center text-xs font-semibold py-1">
                  {dayName}
                </div>
              ))}

              {/* Grid blank offset for May 2026 (starting on a Friday, which is index 4 in Mon-Sun indexing) */}
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={`blank-${idx}`} className="bg-muted/10 border border-transparent rounded-sm h-16" />
              ))}

              {/* Days grid */}
              {Array.from({ length: currentMonthDays }).map((_, idx) => {
                const day = idx + 1;
                const leaves = getLeavesForDay(day);
                return (
                  <div key={day} className="border border-border bg-background hover:bg-muted/20 rounded-sm p-1.5 h-20 flex flex-col justify-between">
                    <span className="text-foreground text-xs font-medium self-end">{day}</span>
                    <div className="flex flex-col gap-0.5 mt-1 overflow-y-auto max-h-12">
                      {leaves.map((l, i) => (
                        <div
                          key={`${l.name}-${i}`}
                          className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-1 py-0.5 rounded-sm truncate font-medium"
                          title={`${l.name} - ${l.type}`}
                        >
                          {l.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
