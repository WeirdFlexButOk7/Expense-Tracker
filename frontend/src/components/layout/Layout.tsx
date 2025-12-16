import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
