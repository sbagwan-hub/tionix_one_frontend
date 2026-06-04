'use client';

import * as React from 'react';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`border-t bg-background p-4 text-center text-sm text-muted-foreground ${className}`}>
      <p>&copy; 2026 Tionix One. All rights reserved.</p>
    </footer>
  );
}
