'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Target, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { hrmsCardClassName, hrmsInputClassName } from '@/modules/hrms/components/hrms-styles';
import { type HrmsGeofenceConfig } from '@/constants/hrms-geofencing.constants';

const HrmsLiveLocationMap = dynamic(() => import('@/modules/hrms/components/hrms-live-location-map'), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-full min-h-[500px] items-center justify-center text-sm">
      Loading map...
    </div>
  ),
});

const DEFAULT_FENCES: HrmsGeofenceConfig[] = [
  { officeName: 'Thane Office', latitude: 19.187053, longitude: 72.977937, radiusMeters: 250, enabled: true },
  { officeName: 'Koparkairane Office', latitude: 19.112000, longitude: 73.010000, radiusMeters: 250, enabled: true },
  { officeName: 'Kalyan Office', latitude: 19.240000, longitude: 73.130000, radiusMeters: 250, enabled: true },
  { officeName: 'My Home Office', latitude: 19.076000, longitude: 72.877700, radiusMeters: 350, enabled: true },
];

const STORAGE_FENCES_KEY = 'hrms_configured_fences_list';
const STORAGE_ACTIVE_INDEX_KEY = 'hrms_active_fence_index';

export default function HrmsGeofencingView() {
  const [fences, setFences] = useState<HrmsGeofenceConfig[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [siteName, setSiteName] = useState<string>('Thane Office');
  const [latitude, setLatitude] = useState<number>(19.187053);
  const [longitude, setLongitude] = useState<number>(72.977937);
  const [radius, setRadius] = useState<number>(250);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedFences = localStorage.getItem(STORAGE_FENCES_KEY);
    const savedActiveIndex = localStorage.getItem(STORAGE_ACTIVE_INDEX_KEY);
    
    if (savedFences) {
      try {
        const parsed = JSON.parse(savedFences) as HrmsGeofenceConfig[];
        setFences(parsed);
        const idx = savedActiveIndex ? Number(savedActiveIndex) : 0;
        setActiveIndex(idx);
        if (parsed[idx]) {
          setSiteName(parsed[idx].officeName);
          setLatitude(parsed[idx].latitude);
          setLongitude(parsed[idx].longitude);
          setRadius(parsed[idx].radiusMeters);
        }
      } catch (e) {
        console.error(e);
        setFences(DEFAULT_FENCES);
        localStorage.setItem(STORAGE_FENCES_KEY, JSON.stringify(DEFAULT_FENCES));
      }
    } else {
      setFences(DEFAULT_FENCES);
      localStorage.setItem(STORAGE_FENCES_KEY, JSON.stringify(DEFAULT_FENCES));
    }
  }, []);

  const handleSelectFence = (index: number) => {
    setActiveIndex(index);
    localStorage.setItem(STORAGE_ACTIVE_INDEX_KEY, String(index));
    const selected = fences[index];
    if (selected) {
      setSiteName(selected.officeName);
      setLatitude(selected.latitude);
      setLongitude(selected.longitude);
      setRadius(selected.radiusMeters);
    }
  };

  const handleSaveGeofence = () => {
    const updatedFence: HrmsGeofenceConfig = {
      officeName: siteName.trim() || 'Untitled Office',
      latitude,
      longitude,
      radiusMeters: radius,
      enabled: true,
    };

    let updatedFences = [...fences];
    // If exact name exists, update it, otherwise check active index, or append if active index is invalid
    const existingIndex = fences.findIndex(
      (f) => f.officeName.toLowerCase() === siteName.trim().toLowerCase()
    );

    if (existingIndex >= 0) {
      updatedFences[existingIndex] = updatedFence;
      setActiveIndex(existingIndex);
      localStorage.setItem(STORAGE_ACTIVE_INDEX_KEY, String(existingIndex));
    } else {
      updatedFences.push(updatedFence);
      setActiveIndex(updatedFences.length - 1);
      localStorage.setItem(STORAGE_ACTIVE_INDEX_KEY, String(updatedFences.length - 1));
    }

    setFences(updatedFences);
    localStorage.setItem(STORAGE_FENCES_KEY, JSON.stringify(updatedFences));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const activeGeofence: HrmsGeofenceConfig = {
    officeName: siteName,
    latitude,
    longitude,
    radiusMeters: radius,
    enabled: true,
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      {/* Sidebar Form & List */}
      <div className="flex flex-col gap-6 lg:col-span-3">
        {/* Form */}
        <div className={`${hrmsCardClassName} p-5`}>
          <h2 className="text-base font-semibold text-foreground mb-4">New Perimeter</h2>
          
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="site-name"
                className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1 block"
              >
                Site Name
              </Label>
              <Input
                id="site-name"
                className={`${hrmsInputClassName} h-10 border-border/60`}
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. Thane Office"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="latitude"
                  className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1 block"
                >
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  className={`${hrmsInputClassName} h-10 border-border/60`}
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                />
              </div>
              <div>
                <Label
                  htmlFor="longitude"
                  className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1 block"
                >
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  className={`${hrmsInputClassName} h-10 border-border/60`}
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label
                  htmlFor="radius"
                  className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
                >
                  Radius (Meters)
                </Label>
                <span className="text-xs font-semibold text-foreground">{radius}m</span>
              </div>
              <input
                id="radius"
                type="range"
                min="25"
                max="1000"
                step="25"
                className="w-full accent-black dark:accent-white cursor-pointer h-1.5 bg-muted rounded-sm appearance-none"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
            </div>

            <Button
              type="button"
              variant="default"
              className="w-full h-10 mt-2 rounded-sm font-medium transition-colors"
              onClick={handleSaveGeofence}
            >
              Save Geo-fence
            </Button>
          </div>
        </div>

        {/* List of Configured Fences */}
        <div className={`${hrmsCardClassName} p-5`}>
          <h2 className="text-base font-semibold text-foreground mb-4">Configured Fences</h2>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {fences.map((fence, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectFence(index)}
                  className={`w-full text-left p-3 rounded-sm border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-background hover:bg-muted/30 border-border/40'
                  }`}
                >
                  <MapPin className={`size-4 mt-0.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                      {fence.officeName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fence.radiusMeters}m perimeter
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map Panel */}
      <div className="lg:col-span-7 flex flex-col">
        <div className={`${hrmsCardClassName} flex-1 flex flex-col overflow-hidden`}>
          {/* Header Info Bar */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30 border-border/60">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Target className="size-4 text-muted-foreground/60" />
              <span>Click anywhere to position the new center</span>
            </div>
            
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Editor
            </div>
          </div>

          {/* Interactive Map */}
          <div className="flex-1 min-h-[500px] h-[550px] relative">
            <HrmsLiveLocationMap
              geofence={activeGeofence}
              locations={[]}
              onMapClick={handleMapClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
