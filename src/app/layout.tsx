import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import QueryProviders from '@/providers/QueryProviders';
import { LocaleUpdater } from '@/components/shared/locale-updater';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LayoutWrapper } from '@/components/shared/layout-wrapper';
import { Toaster } from '@/components/ui/sonner';

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
          <QueryProviders>
            <LocaleUpdater />
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster position="top-right" />
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
