"use client";

import { AppHeader } from "./AppHeader";
import { SidebarMenu } from "./SidebarMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarMenu />
      <div className="md:pl-[280px]">
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
