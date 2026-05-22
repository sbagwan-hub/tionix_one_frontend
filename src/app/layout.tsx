import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import QueryProviders from '@/providers/QueryProviders';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { LocaleUpdater } from '@/components/shared/locale-updater';
import { ThemeProvider } from 'next-themes';

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
        <QueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="theme"
          >
            <LocaleUpdater />
            <div className="fixed top-0 right-0 left-0 z-50">
              <Navbar />
            </div>

            <main className="mx-4 my-2 h-full overflow-y-auto pt-20 pb-8">{children}</main>

            <div className="fixed right-0 bottom-0 left-0 z-50">
              <Footer />
            </div>
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
