// src/components/layout/MainLayout.tsx
import { useUIStore } from '@/store/uiStore'; // Assuming useUIStore exists
import React from 'react';
import { MobileNav } from './MobileNav'; // Assuming MobileNav exists
import { Sidebar } from './Sidebar'; // Assuming Sidebar exists

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar, toggleMobileMenu, isMobileMenuOpen, closeMobileMenu } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileNav onMenuClick={toggleMobileMenu} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen || isMobileMenuOpen} onClose={() => { closeSidebar(); closeMobileMenu(); }} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {(isSidebarOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => { closeSidebar(); closeMobileMenu(); }}
        />
      )}
    </div>
  );
}
