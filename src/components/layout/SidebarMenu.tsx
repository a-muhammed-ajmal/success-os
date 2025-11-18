"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_SECTIONS } from "../../lib/config/design";
import { cn } from "../../lib/utils";
import { useLayoutStore } from "../../store/layoutStore";

export function SidebarMenu() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useLayoutStore();

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-background-secondary border-r border-border z-50 transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Success OS</h1>
                <p className="text-xs text-foreground-muted">Personal OS</p>
              </div>
            </div>

            <button
              onClick={closeSidebar}
              className="md:hidden p-2 hover:bg-background-tertiary rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-foreground-secondary" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {SIDEBAR_SECTIONS.map((section) => {
              const isActive = pathname === section.href;
              const Icon = section.icon;

              return (
                <Link
                  key={section.id}
                  href={section.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      closeSidebar();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-background-tertiary",
                    isActive
                      ? "bg-background-tertiary border-l-4"
                      : "border-l-4 border-transparent"
                  )}
                  style={{
                    borderLeftColor: isActive ? section.color : "transparent",
                  }}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color: isActive ? section.color : "#a1a1aa",
                    }}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-foreground-secondary"
                    )}
                  >
                    {section.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-semibold">MA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Muhammed Ajmal
                </p>
                <p className="text-xs text-foreground-muted truncate">
                  muhammed@example.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
