'use client';

import { LocateFixed, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { HrmsGeofenceConfig } from '@/constants/hrms-geofencing.constants';
import { hrmsButtonClassName, hrmsCardClassName, hrmsInputClassName } from './hrms-styles';

type HrmsGeofencingSettingsProps = {
  config: HrmsGeofenceConfig;
  onChange: (config: HrmsGeofenceConfig) => void;
  onSave: () => void;
};

export default function HrmsGeofencingSettings({
  config,
  onChange,
  onSave,
}: HrmsGeofencingSettingsProps) {
  const updateField = <K extends keyof HrmsGeofenceConfig>(key: K, value: HrmsGeofenceConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      window.alert('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          ...config,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
      },
      () => {
        window.alert('Unable to fetch your current location.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={hrmsCardClassName}>
      <div className="border-border border-b px-4 py-3">
        <h2 className="text-foreground text-sm font-semibold">Geofencing Settings</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Set office location and attendance radius. Employees inside the circle are marked present.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-2">
          <Label
            htmlFor="office-name"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Office Name
          </Label>
          <Input
            id="office-name"
            className={hrmsInputClassName}
            value={config.officeName}
            onChange={(event) => updateField('officeName', event.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="office-latitude"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Latitude
          </Label>
          <Input
            id="office-latitude"
            type="number"
            step="0.000001"
            className={hrmsInputClassName}
            value={config.latitude}
            onChange={(event) => updateField('latitude', Number(event.target.value))}
          />
        </div>

        <div>
          <Label
            htmlFor="office-longitude"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Longitude
          </Label>
          <Input
            id="office-longitude"
            type="number"
            step="0.000001"
            className={hrmsInputClassName}
            value={config.longitude}
            onChange={(event) => updateField('longitude', Number(event.target.value))}
          />
        </div>

        <div>
          <Label
            htmlFor="geo-radius"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Geo Radius (meters)
          </Label>
          <Input
            id="geo-radius"
            type="number"
            min={25}
            max={5000}
            step={25}
            className={hrmsInputClassName}
            value={config.radiusMeters}
            onChange={(event) => updateField('radiusMeters', Number(event.target.value))}
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-3">
          <Button
            type="button"
            variant="outline"
            className={hrmsButtonClassName}
            onClick={useCurrentLocation}
          >
            <LocateFixed className="size-3.5" />
            Use My Location
          </Button>
          <Button type="button" className={hrmsButtonClassName} onClick={onSave}>
            <Save className="size-3.5" />
            Save Geofence
          </Button>
        </div>
      </div>
    </div>
  );
}
