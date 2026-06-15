'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { GlobalWindows } from './global-windows';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith('/auth/');

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {!isAuth && (
        <div className="shrink-0 z-50">
          <Navbar />
        </div>
      )}

      <main
        className={`overflow-x-hidden overflow-y-auto flex-1 min-h-0 transition-all duration-300 ${
          isAuth ? 'mx-0 my-0 h-full w-full' : 'mx-4 my-2'
        }`}
      >
        {children}
      </main>

      {!isAuth && <GlobalWindows />}

      {!isAuth && (
        <div className="shrink-0 z-50">
          <Footer />
        </div>
      )}
    </div>
  );
}
