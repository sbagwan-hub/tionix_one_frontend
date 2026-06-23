'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { GlobalWindows } from './global-windows';
import { useAuthStore } from '@/stores/auth-store';
import { useMyUserRights } from '@/modules/user-right/hooks/use-user-rights';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith('/auth/');

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Automatically fetch & sync user rights to store via custom query hook
  useMyUserRights(isAuthenticated && !isAuth);

  return (
    <div className="bg-background flex h-screen w-full flex-col overflow-hidden">
      {!isAuth && (
        <div className="z-50 shrink-0">
          <Navbar />
        </div>
      )}

      <main
        className={`overflow-hidden transition-all duration-300 ${
          isAuth ? 'mx-0 my-0 h-screen w-screen pt-0 pb-0' : 'mx-4 my-2 h-full pt-0 pb-2'
        }`}
      >
        {children}
      </main>

      {!isAuth && <GlobalWindows />}

      {!isAuth && (
        <div className="z-50 shrink-0">
          <Footer />
        </div>
      )}
    </div>
  );
}
