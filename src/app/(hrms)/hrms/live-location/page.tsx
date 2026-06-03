'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HrmsLiveLocationView from '@/components/hrms/hrms-live-location-view';
import { hrmsControlRadiusClassName, hrmsPageClassName } from '@/components/hrms/hrms-styles';

export default function HrmsLiveLocationPage() {
  return (
    <div className={`${hrmsPageClassName} px-4 py-4 pb-6 font-sans`}>
      <div className={`flex flex-col gap-4 ${hrmsControlRadiusClassName}`}>
        <div className="flex items-start gap-3">
          <Link href="/hrms/dashboard">
            <Button type="button" variant="outline" size="icon" className="rounded-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-foreground text-xl font-semibold">Live Location</h1>
            <p className="text-muted-foreground text-sm">
              Track employee locations in real time using the office geofence.
            </p>
          </div>
        </div>

        <HrmsLiveLocationView />
      </div>
    </div>
  );
}
