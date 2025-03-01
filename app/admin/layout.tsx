'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import Sidebar from '@/app/admin/components/sidebar';
import Header from '@/app/admin/components/header';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Fixed width, Full Height */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} duration-300 ease-in-out`}>
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                pathname={pathname}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 ml-64 min-w-0">
              {/* Header - Stays on top */}
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

              {/* Main Content */}
              <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
