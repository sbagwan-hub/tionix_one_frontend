'use client';

import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HrmsGeofencingView from '@/components/hrms/hrms-geofencing-view';
import { hrmsControlRadiusClassName, hrmsPageClassName } from '@/components/hrms/hrms-styles';

export default function HrmsGeofencingPage() {
  return (
    <div className={`${hrmsPageClassName} px-6 py-6 pb-8 font-sans`}>
      <div className={`flex flex-col gap-6 ${hrmsControlRadiusClassName}`}>
        <div className="flex items-start gap-4">
          <Link href="/hrms/dashboard">
            <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-sm border-border/60">
              <ArrowLeft className="size-4 text-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Geofencing Management</h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Globe className="size-4" />
              <span>Define site perimeters for automated check-ins.</span>
            </div>
          </div>
        </div>

        <HrmsGeofencingView />
      </div>
    </div>
  );
}
