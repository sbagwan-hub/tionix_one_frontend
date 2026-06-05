import type { HrmsEmployee } from '@/constants/hrms-dashboard.constants';
import {
  formatDistanceMeters,
  getDistanceMeters,
  isInsideGeofence,
  type GeoPoint,
} from '@/lib/hrms-geofencing';

export type HrmsGeofenceConfig = {
  officeName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  enabled: boolean;
};

export type HrmsEmployeeLiveLocation = {
  employeeId: string;
  name: string;
  department: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
  distanceMeters: number;
  insideGeofence: boolean;
  attendanceEligible: boolean;
};

export const HRMS_GEOFENCE_STORAGE_KEY = 'hrms_geofence_config';
export const HRMS_LIVE_LOCATIONS_STORAGE_KEY = 'hrms_live_locations';

export const defaultHrmsGeofenceConfig: HrmsGeofenceConfig = {
  officeName: 'Falcon Material Handling - Jebel Ali',
  latitude: 25.0094,
  longitude: 55.0708,
  radiusMeters: 25,
  enabled: true,
};

const locationOffsets: GeoPoint[] = [
  { latitude: 0.00025, longitude: 0.00018 },
  { latitude: -0.00012, longitude: 0.00042 },
  { latitude: 0.00055, longitude: -0.00028 },
  { latitude: -0.00048, longitude: -0.00035 },
  { latitude: 0.00105, longitude: 0.00062 },
  { latitude: -0.0012, longitude: 0.00015 },
  { latitude: 0.0008, longitude: -0.0009 },
  { latitude: -0.0007, longitude: 0.00095 },
];

function createSeedLocation(
  employee: HrmsEmployee,
  index: number,
  office: HrmsGeofenceConfig,
): GeoPoint {
  const offset = locationOffsets[index % locationOffsets.length];
  return {
    latitude: office.latitude + offset.latitude,
    longitude: office.longitude + offset.longitude,
  };
}

export function buildEmployeeLiveLocations(
  employees: readonly HrmsEmployee[],
  geofence: HrmsGeofenceConfig,
  positions?: Record<string, GeoPoint>,
): HrmsEmployeeLiveLocation[] {
  const officePoint: GeoPoint = {
    latitude: geofence.latitude,
    longitude: geofence.longitude,
  };

  return employees.map((employee, index) => {
    const point = positions?.[employee.id] ?? createSeedLocation(employee, index, geofence);
    const distanceMeters = getDistanceMeters(officePoint, point);
    const insideGeofence = geofence.enabled
      ? isInsideGeofence(point, officePoint, geofence.radiusMeters)
      : true;

    return {
      employeeId: employee.id,
      name: employee.name,
      department: employee.department,
      latitude: point.latitude,
      longitude: point.longitude,
      updatedAt: new Date().toISOString(),
      distanceMeters,
      insideGeofence,
      attendanceEligible: insideGeofence,
    };
  });
}

export function summarizeLiveLocations(locations: readonly HrmsEmployeeLiveLocation[]) {
  const insideCount = locations.filter((location) => location.insideGeofence).length;
  const outsideCount = locations.length - insideCount;

  return {
    total: locations.length,
    insideCount,
    outsideCount,
    attendanceRate: locations.length === 0 ? 0 : Math.round((insideCount / locations.length) * 100),
  };
}

export function formatEmployeeDistance(distanceMeters: number) {
  return formatDistanceMeters(distanceMeters);
}
