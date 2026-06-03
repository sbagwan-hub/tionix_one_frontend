export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export function getDistanceMeters(from: GeoPoint, to: GeoPoint) {
  const earthRadiusMeters = 6371000;
  const latDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const lngDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const fromLat = (from.latitude * Math.PI) / 180;
  const toLat = (to.latitude * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isInsideGeofence(
  point: GeoPoint,
  center: GeoPoint,
  radiusMeters: number,
) {
  return getDistanceMeters(center, point) <= radiusMeters;
}

export function formatDistanceMeters(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(2)} km`;
}

export function jitterGeoPoint(point: GeoPoint, maxOffsetMeters = 12): GeoPoint {
  const latOffset = ((Math.random() - 0.5) * maxOffsetMeters) / 111320;
  const lngOffset =
    ((Math.random() - 0.5) * maxOffsetMeters) /
    (111320 * Math.cos((point.latitude * Math.PI) / 180));

  return {
    latitude: point.latitude + latOffset,
    longitude: point.longitude + lngOffset,
  };
}
