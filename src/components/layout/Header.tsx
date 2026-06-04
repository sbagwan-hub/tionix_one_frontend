'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <div className={`flex h-full ${className}`}>
      <Sidebar />
      <div className="flex-1">
        <Navbar />
      </div>
    </div>
  );
}
