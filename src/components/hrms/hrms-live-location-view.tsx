'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapPin, RefreshCw, Users } from 'lucide-react';
import HrmsLiveLocationPanel from '@/components/hrms/hrms-live-location-panel';
import { hrmsNestedCardClassName } from '@/components/hrms/hrms-styles';
import { recentEmployees } from '@/constants/hrms-dashboard.constants';
import {
  buildEmployeeLiveLocations,
  defaultHrmsGeofenceConfig,
  HRMS_GEOFENCE_STORAGE_KEY,
  summarizeLiveLocations,
  type HrmsEmployeeLiveLocation,
  type HrmsGeofenceConfig,
} from '@/constants/hrms-geofencing.constants';
import { jitterGeoPoint, type GeoPoint } from '@/lib/hrms-geofencing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const HrmsLiveLocationMap = dynamic(() => import('@/components/hrms/hrms-live-location-map'), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-full min-h-[420px] items-center justify-center text-sm">
      Loading map...
    </div>
  ),
});

const LIVE_REFRESH_MS = 5000;

function formatUpdatedTime() {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function HrmsLiveLocationView() {
  const [geofence, setGeofence] = useState<HrmsGeofenceConfig>(defaultHrmsGeofenceConfig);
  const [employeeIds, setEmployeeIds] = useState<string[]>(() =>
    recentEmployees.map((employee) => employee.id),
  );
  const [employees, setEmployees] = useState(() => [...recentEmployees]);
  const [positions, setPositions] = useState<Record<string, GeoPoint>>({});
  const [locations, setLocations] = useState<HrmsEmployeeLiveLocation[]>([]);
  const [lastUpdated, setLastUpdated] = useState('--:--:--');
  const [isLoaded, setIsLoaded] = useState(false);

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employeeIds.includes(employee.id)),
    [employeeIds, employees],
  );

  const applyLocations = (nextGeofence: HrmsGeofenceConfig, nextPositions: Record<string, GeoPoint>) => {
    setLocations(buildEmployeeLiveLocations(activeEmployees, nextGeofence, nextPositions));
    setLastUpdated(formatUpdatedTime());
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedEmployees = localStorage.getItem('hrms_employees');
    if (savedEmployees) {
      try {
        const parsed = JSON.parse(savedEmployees);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmployees(parsed);
          setEmployeeIds(parsed.map((employee: { id: string }) => employee.id));
        }
      } catch (error) {
        console.error(error);
      }
    }

    const loadGeofence = () => {
      const savedGeofence = localStorage.getItem(HRMS_GEOFENCE_STORAGE_KEY);
      if (!savedGeofence) {
        setGeofence(defaultHrmsGeofenceConfig);
        return;
      }

      try {
        setGeofence(JSON.parse(savedGeofence) as HrmsGeofenceConfig);
      } catch (error) {
        console.error(error);
        setGeofence(defaultHrmsGeofenceConfig);
      }
    };

    loadGeofence();
    window.addEventListener('focus', loadGeofence);

    setIsLoaded(true);

    return () => window.removeEventListener('focus', loadGeofence);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const seedPositions = Object.fromEntries(
      buildEmployeeLiveLocations(activeEmployees, geofence).map((location) => [
        location.employeeId,
        { latitude: location.latitude, longitude: location.longitude },
      ]),
    );

    setPositions(seedPositions);
    applyLocations(geofence, seedPositions);
  }, [activeEmployees, geofence, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const timer = window.setInterval(() => {
      setPositions((current) => {
        const nextPositions = Object.fromEntries(
          Object.entries(current).map(([employeeId, point]) => [
            employeeId,
            jitterGeoPoint(point, 10),
          ]),
        );

        applyLocations(geofence, nextPositions);
        return nextPositions;
      });
    }, LIVE_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [activeEmployees, geofence, isLoaded]);

  const summary = useMemo(() => summarizeLiveLocations(locations), [locations]);

  const handleRefreshNow = () => {
    applyLocations(geofence, positions);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs">
          Geofence: {geofence.officeName} · {geofence.radiusMeters} m radius
        </p>
        <div className="flex gap-2">
          <Link href="/hrms/geofencing">
            <Button type="button" variant="outline" className="rounded-sm">
              Geofencing Settings
            </Button>
          </Link>
          <Button type="button" variant="outline" className="rounded-sm" onClick={handleRefreshNow}>
            <RefreshCw className="size-3.5" />
            Refresh Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className={cn(hrmsNestedCardClassName, 'p-4')}>
          <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
            <Users className="size-3.5" />
            Tracked Employees
          </div>
          <p className="text-foreground mt-2 text-2xl font-semibold">{summary.total}</p>
        </div>
        <div className={cn(hrmsNestedCardClassName, 'p-4')}>
          <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
            <MapPin className="size-3.5" />
            Inside Geofence
          </div>
          <p className="text-foreground mt-2 text-2xl font-semibold">{summary.insideCount}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {summary.attendanceRate}% attendance eligible
          </p>
        </div>
        <div className={cn(hrmsNestedCardClassName, 'p-4')}>
          <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
            <MapPin className="size-3.5" />
            Outside Geofence
          </div>
          <p className="text-foreground mt-2 text-2xl font-semibold">{summary.outsideCount}</p>
          <p className="text-muted-foreground mt-1 text-xs">Radius: {geofence.radiusMeters} m</p>
        </div>
      </div>

      <div className="border-border bg-background overflow-hidden rounded-sm border">
        <div className="border-border border-b px-4 py-3">
          <h2 className="text-foreground text-sm font-semibold">Live Map</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Blue circle is the office geofence. Green markers are inside, red markers are outside.
          </p>
        </div>
        <div className="h-[420px] w-full">
          <HrmsLiveLocationMap geofence={geofence} locations={locations} />
        </div>
      </div>

      <HrmsLiveLocationPanel locations={locations} lastUpdated={lastUpdated} />
    </div>
  );
}
