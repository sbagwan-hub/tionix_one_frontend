'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatEmployeeDistance,
  type HrmsEmployeeLiveLocation,
} from '@/constants/hrms-geofencing.constants';
import { HrmsStatusBadge } from './hrms-stat-cards';
import { hrmsCardClassName } from './hrms-styles';

type HrmsLiveLocationPanelProps = {
  locations: HrmsEmployeeLiveLocation[];
  lastUpdated: string;
};

export default function HrmsLiveLocationPanel({
  locations,
  lastUpdated,
}: HrmsLiveLocationPanelProps) {
  return (
    <div className={hrmsCardClassName}>
      <div className="border-border flex items-start justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-foreground text-sm font-semibold">Live Employee Locations</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Real-time positions with geofence attendance status. Last update: {lastUpdated}
          </p>
        </div>
      </div>

      <Table className="min-w-full border-separate border-spacing-0 text-left">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Employee
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Department
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-right text-xs font-semibold tracking-[0.14em] uppercase">
              Distance
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Geofence
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Attendance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-border divide-y">
          {locations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground p-8 text-center text-sm">
                No employee locations available.
              </TableCell>
            </TableRow>
          ) : (
            locations.map((location) => (
              <TableRow key={location.employeeId}>
                <TableCell className="p-4">
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">{location.name}</span>
                    <span className="text-muted-foreground text-xs">{location.employeeId}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground p-4 text-sm">{location.department}</TableCell>
                <TableCell className="text-foreground p-4 text-right text-sm">
                  {formatEmployeeDistance(location.distanceMeters)}
                </TableCell>
                <TableCell className="p-4 text-center">
                  <HrmsStatusBadge
                    status={location.insideGeofence ? 'Inside' : 'Outside'}
                    className={
                      location.insideGeofence
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400'
                    }
                  />
                </TableCell>
                <TableCell className="p-4 text-center">
                  <HrmsStatusBadge
                    status={location.attendanceEligible ? 'Eligible' : 'Out of Range'}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
