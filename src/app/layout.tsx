import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import QueryProviders from '@/providers/query-providers';
import { LocaleUpdater } from '@/components/shared/locale-updater';
import { ThemeProvider } from '@/providers/theme-provider';
import { FontSizeProvider } from '@/providers/font-size-provider';
import { Toaster } from '@/components/ui/sonner';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tionix',
  description: 'ERP System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` ${geistSans.className} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen overflow-hidden">
        <ThemeProvider>
          <FontSizeProvider>
            <QueryProviders>
              <LocaleUpdater />
              <LayoutWrapper>{children}</LayoutWrapper>
              <Toaster position="top-right" />
            </QueryProviders>
          </FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
