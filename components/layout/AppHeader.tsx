"use client";

import { Button } from "components/ui/button";
import { Bell, Menu, Search, Settings } from "lucide-react";
import { useLayoutStore } from "store/layoutStore";

export function AppHeader() {
  const { toggleSidebar } = useLayoutStore();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-background-secondary/60">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg border border-border w-[400px]">
            <Search className="w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search tasks, clients, transactions..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground-muted"
            />
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-foreground-muted">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>

          <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-semibold">MA</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
