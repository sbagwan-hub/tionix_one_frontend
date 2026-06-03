'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === '/log_in' || pathname === '/login' || pathname === '/sign_up' || pathname?.startsWith('/auth/');

  return (
    <>
      {!isAuth && (
        <div className="fixed top-0 right-0 left-0 z-50">
          <Navbar />
        </div>
      )}

      <main
        className={`overflow-hidden transition-all duration-300 ${
          isAuth ? 'h-screen w-screen mx-0 my-0 pt-0 pb-0' : 'h-full mx-4 my-2 pt-20 pb-8'
        }`}
      >
        {children}
      </main>

      {!isAuth && (
        <div className="fixed right-0 bottom-0 left-0 z-50">
          <Footer />
        </div>
      )}
    </>
  );
}
