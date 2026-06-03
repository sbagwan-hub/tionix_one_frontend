import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  FileOutput,
  HelpCircle,
  LogOut,
  Plus,
  Printer,
  RefreshCw,
  UserPlus,
  Users,
} from 'lucide-react';

export type HrmsEmployee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: string;
  joinedOn: string;
};

export type HrmsEmployeeFormValues = {
  name: string;
  department: string;
  designation: string;
  status: string;
  joinedOn: string;
};

export const hrmsDepartments = [
  'Human Resources',
  'Finance',
  'Operations',
  'Sales',
  'IT',
  'Admin',
] as const;

export const hrmsEmployeeStatuses = ['Active', 'Probation'] as const;

export function createNextEmployeeId(employees: readonly HrmsEmployee[]) {
  const maxId = employees.reduce((max, employee) => {
    const numericId = Number.parseInt(employee.id.replace('EMP-', ''), 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);

  return `EMP-${maxId + 1}`;
}

export function formatHrmsJoinDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function parseHrmsJoinDateForInput(joinedOn: string) {
  const date = new Date(joinedOn);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);

  return date.toISOString().slice(0, 10);
}

export type HrmsEmployeeFilters = {
  search: string;
  department: string;
  period: string;
  location: string;
};

export const defaultHrmsEmployeeFilters: HrmsEmployeeFilters = {
  search: '',
  department: '',
  period: 'May 2026',
  location: '',
};

export function filterEmployees(employees: readonly HrmsEmployee[], filters: HrmsEmployeeFilters) {
  const search = filters.search.trim().toLowerCase();
  const department = filters.department.trim().toLowerCase();

  return employees.filter((employee) => {
    const matchesSearch =
      !search ||
      employee.name.toLowerCase().includes(search) ||
      employee.id.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search) ||
      employee.designation.toLowerCase().includes(search);

    const matchesDepartment = !department || employee.department.toLowerCase().includes(department);

    return matchesSearch && matchesDepartment;
  });
}

export const hrmsStats = [
  {
    id: 'employees',
    label: 'Total Employees',
    value: '248',
    change: '+6 this month',
    icon: Users,
  },
  {
    id: 'present',
    label: 'Present Today',
    value: '231',
    change: '93.1% attendance',
    icon: Clock3,
  },
  {
    id: 'leave',
    label: 'On Leave',
    value: '12',
    change: '3 pending approval',
    icon: CalendarDays,
  },
  {
    id: 'openings',
    label: 'Open Positions',
    value: '7',
    change: '2 interviews today',
    icon: UserPlus,
  },
] as const;

export const recentEmployees = [
  {
    id: 'EMP-248',
    name: 'Aisha Khan',
    department: 'Human Resources',
    designation: 'HR Executive',
    status: 'Active',
    joinedOn: '12 May 2026',
  },
  {
    id: 'EMP-247',
    name: 'Rahul Mehta',
    department: 'Finance',
    designation: 'Accounts Manager',
    status: 'Active',
    joinedOn: '08 May 2026',
  },
  {
    id: 'EMP-246',
    name: 'Sarah Johnson',
    department: 'Operations',
    designation: 'Team Lead',
    status: 'Probation',
    joinedOn: '02 May 2026',
  },
  {
    id: 'EMP-245',
    name: 'Mohammed Ali',
    department: 'Sales',
    designation: 'Sales Officer',
    status: 'Active',
    joinedOn: '28 Apr 2026',
  },
  {
    id: 'EMP-244',
    name: 'Priya Sharma',
    department: 'IT',
    designation: 'Software Engineer',
    status: 'Active',
    joinedOn: '21 Apr 2026',
  },
] as const;

export const leaveRequests = [
  {
    id: 'LR-1042',
    employee: 'James Wilson',
    type: 'Annual Leave',
    from: '28 May 2026',
    to: '30 May 2026',
    days: 3,
    status: 'Pending',
  },
  {
    id: 'LR-1041',
    employee: 'Fatima Hassan',
    type: 'Sick Leave',
    from: '27 May 2026',
    to: '27 May 2026',
    days: 1,
    status: 'Approved',
  },
  {
    id: 'LR-1040',
    employee: 'David Chen',
    type: 'Work From Home',
    from: '26 May 2026',
    to: '26 May 2026',
    days: 1,
    status: 'Approved',
  },
  {
    id: 'LR-1039',
    employee: 'Emily Brown',
    type: 'Annual Leave',
    from: '02 Jun 2026',
    to: '06 Jun 2026',
    days: 5,
    status: 'Pending',
  },
] as const;

export const attendanceSummary = [
  { department: 'Human Resources', present: 18, absent: 1, onLeave: 2 },
  { department: 'Finance', present: 24, absent: 0, onLeave: 1 },
  { department: 'Operations', present: 56, absent: 3, onLeave: 4 },
  { department: 'Sales', present: 42, absent: 2, onLeave: 2 },
  { department: 'IT', present: 31, absent: 1, onLeave: 1 },
] as const;

export const attendanceTrend = [
  { day: 'Mon', present: 226, absent: 14 },
  { day: 'Tue', present: 229, absent: 11 },
  { day: 'Wed', present: 231, absent: 9 },
  { day: 'Thu', present: 228, absent: 12 },
  { day: 'Fri', present: 231, absent: 9 },
  { day: 'Sat', present: 118, absent: 6 },
  { day: 'Sun', present: 42, absent: 4 },
] as const;

export const headcountByDepartment = [
  { department: 'HR', employees: 21 },
  { department: 'Finance', employees: 25 },
  { department: 'Operations', employees: 63 },
  { department: 'Sales', employees: 46 },
  { department: 'IT', employees: 33 },
  { department: 'Admin', employees: 60 },
] as const;

export const upcomingEvents = [
  { id: '1', label: 'Payroll Processing', date: '31 May 2026', type: 'Payroll' },
  { id: '2', label: 'Performance Review Cycle', date: '05 Jun 2026', type: 'Review' },
  { id: '3', label: 'Safety Training Session', date: '10 Jun 2026', type: 'Training' },
  { id: '4', label: 'Birthday: Aisha Khan', date: '14 Jun 2026', type: 'Celebration' },
] as const;

export const hrmsTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'employees', label: 'Employees' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'live-location', label: 'Live Location' },
  { value: 'geofencing', label: 'Geofencing' },
  { value: 'leave', label: 'Leave' },
  { value: 'payroll', label: 'Payroll' },
] as const;

export const hrmsNavigationToolbar = [
  { icon: ChevronsLeft, title: 'First', onClick: () => console.log('First') },
  { icon: ChevronLeft, title: 'Previous', onClick: () => console.log('Previous') },
  { icon: ChevronRight, title: 'Next', onClick: () => console.log('Next') },
  { icon: ChevronsRight, title: 'Last', onClick: () => console.log('Last') },
] as const;

export const hrmsActionToolbar = [
  {
    label: 'Add Employee',
    icon: Plus,
    variant: 'primary' as const,
  },
  {
    label: 'Refresh',
    icon: RefreshCw,
    variant: 'secondary' as const,
    onClick: () => window.location.reload(),
  },
] as const;

export function buildHrmsActionToolbar(handlers: { onAddEmployee: () => void }) {
  return hrmsActionToolbar.map((action) => {
    if (action.label === 'Add Employee') {
      return { ...action, onClick: handlers.onAddEmployee };
    }

    return action;
  });
}

export const hrmsUtilityToolbar = [
  { icon: Printer, title: 'Print', onClick: () => window.print() },
  { icon: FileOutput, title: 'Export', onClick: () => console.log('Export') },
  { icon: HelpCircle, title: 'Help', onClick: () => alert('HRMS Help') },
  { icon: LogOut, title: 'Exit', onClick: () => console.log('Exit') },
] as const;
