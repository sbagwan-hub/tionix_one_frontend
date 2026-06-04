'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export function FormHeader({ title, description, backHref, actions }: FormHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-border/40 bg-card mb-6 flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        {backHref && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(backHref)}
            className="h-8 w-8 rounded-full"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <div>
          <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
          {description && <p className="text-muted-foreground text-xs sm:text-sm">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
