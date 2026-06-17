'use client';

import { Button } from '@/components/modern-ui/button';
import { toast } from '@/components/modern-ui/sonner';
import { CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden p-6">
      <div className="border-border bg-card flex max-w-2xl flex-col gap-4 rounded-xl border p-6 shadow-sm">
        <h2 className="text-foreground mb-2 text-lg font-semibold">
          Custom Sonner Notification Test Center
        </h2>

        <div className="flex flex-wrap gap-3">
          {/* Custom JSX Toast provided in user request */}
          <Button
            onClick={() => {
              toast(
                <div className="flex items-center gap-2 p-1">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                  <div className="flex flex-col text-left">
                    <span className="text-foreground text-sm font-semibold">
                      Payment successful
                    </span>
                    <span className="text-muted-foreground text-xs">Transaction ID: 78912364</span>
                  </div>
                </div>,
              );
            }}
          >
            Custom JSX Toast
          </Button>

          {/* Success State */}
          <Button
            variant="success"
            onClick={() => {
              toast.success('Database Synced', {
                description: 'All offline operational records were synchronized successfully.',
              });
            }}
          >
            Success State
          </Button>

          {/* Error State */}
          <Button
            variant="destructive"
            onClick={() => {
              toast.error('Sync Failed', {
                description: 'Unable to establish database connection. Retrying in 5 seconds...',
              });
            }}
          >
            Error State
          </Button>

          {/* Info State */}
          <Button
            variant="outline"
            onClick={() => {
              toast.info('New Update Available', {
                description: 'Version 2.4.0 is available. Please refresh to update.',
              });
            }}
          >
            Info State
          </Button>

          {/* Warning State */}
          <Button
            variant="secondary"
            onClick={() => {
              toast.warning('Disk Space Low', {
                description: 'Server storage is above 85% capacity. Cleanup recommended.',
              });
            }}
          >
            Warning State
          </Button>

          {/* Loading State */}
          <Button
            variant="outline"
            onClick={() => {
              const id = toast.loading('Exporting Report', {
                description: 'Compiling database assets and CSV layouts...',
              });
              setTimeout(() => {
                toast.dismiss(id);
                toast.success('Export Ready', {
                  description: 'Your salary ledger report has been downloaded.',
                });
              }, 3000);
            }}
          >
            Loading Promise State
          </Button>

          {/* Default State */}
          <Button
            variant="ghost"
            onClick={() => {
              toast('Standard Alert', {
                description: 'System cache has been flushed and updated.',
              });
            }}
          >
            Default Toast
          </Button>
        </div>
      </div>
    </main>
  );
}
