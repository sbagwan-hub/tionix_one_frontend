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
        className={`overflow-hidden transition-all duration-300 ${isAuth ? 'mx-0 my-0 h-screen w-screen pt-0 pb-0' : 'mx-4 my-2 h-full pt-10 pb-8'
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
