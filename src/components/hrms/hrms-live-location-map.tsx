'use client';

import { useEffect } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { HrmsGeofenceConfig } from '@/constants/hrms-geofencing.constants';
import type { HrmsEmployeeLiveLocation } from '@/constants/hrms-geofencing.constants';
import 'leaflet/dist/leaflet.css';

const officeIcon = L.divIcon({
  className: '',
  html: `
    <div class="flex items-center justify-center" style="width: 28px; height: 28px;">
      <div style="width: 24px; height: 24px; border-radius: 50%; background: #10b981; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; position: relative;">
        <div style="border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 8px solid white; transform: rotate(180deg); margin-top: 1px;"></div>
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function createEmployeeIcon(insideGeofence: boolean) {
  const color = insideGeofence ? '#10b981' : '#ef4444';

  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${insideGeofence ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function MapViewport({
  geofence,
  locations,
}: {
  geofence: HrmsGeofenceConfig;
  locations: HrmsEmployeeLiveLocation[];
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [
      [geofence.latitude, geofence.longitude],
      ...locations.map((location) => [location.latitude, location.longitude] as [number, number]),
    ];

    if (points.length === 1) {
      map.setView(points[0], 16);
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 17 });
  }, [geofence.latitude, geofence.longitude, geofence.radiusMeters, locations, map]);

  return null;
}

function MapClickEvents({
  onMapClick,
}: {
  onMapClick?: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
      }
    },
  });
  return null;
}

type HrmsLiveLocationMapProps = {
  geofence: HrmsGeofenceConfig;
  locations: HrmsEmployeeLiveLocation[];
  onMapClick?: (latitude: number, longitude: number) => void;
};

export default function HrmsLiveLocationMap({ geofence, locations, onMapClick }: HrmsLiveLocationMapProps) {
  return (
    <MapContainer
      center={[geofence.latitude, geofence.longitude]}
      zoom={16}
      scrollWheelZoom
      className="h-full w-full rounded-sm"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapViewport geofence={geofence} locations={locations} />
      <MapClickEvents onMapClick={onMapClick} />

      <Marker position={[geofence.latitude, geofence.longitude]} icon={officeIcon}>
        <Popup>
          <strong>{geofence.officeName}</strong>
          <br />
          Office location
          <br />
          Radius: {geofence.radiusMeters} m
        </Popup>
      </Marker>

      <Circle
        center={[geofence.latitude, geofence.longitude]}
        radius={geofence.radiusMeters}
        pathOptions={{
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.15,
          weight: 2,
        }}
      />

      {locations.map((location) => (
        <Marker
          key={location.employeeId}
          position={[location.latitude, location.longitude]}
          icon={createEmployeeIcon(location.insideGeofence)}
        >
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.employeeId} · {location.department}
            <br />
            {location.insideGeofence ? 'Inside office geofence' : 'Outside office geofence'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
