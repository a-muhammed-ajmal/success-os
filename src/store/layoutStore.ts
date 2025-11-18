import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * BLACKBOX AI INSTRUCTIONS:
 *
 * This is the Zustand store for managing layout state.
 *
 * STATE:
 * - isSidebarOpen: Controls sidebar visibility (mobile)
 * - isSidebarCollapsed: Controls sidebar collapsed state (desktop)
 * - isMobileMenuOpen: Controls mobile menu overlay
 *
 * ACTIONS:
 * - toggleSidebar: Toggle sidebar on/off
 * - openSidebar: Open sidebar
 * - closeSidebar: Close sidebar
 * - toggleSidebarCollapse: Toggle collapsed state (desktop)
 * - toggleMobileMenu: Toggle mobile menu
 * - closeMobileMenu: Close mobile menu
 *
 * FEATURES:
 * - Persists to localStorage (sidebar preferences saved)
 * - Separate mobile and desktop states
 *
 * USAGE:
 * import { useLayoutStore } from ''store/layoutStore'' (see below for file content);
 *
 * const { isSidebarOpen, toggleSidebar } = useLayoutStore();
 */

interface LayoutState {
  // Sidebar state (mobile)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Sidebar collapsed state (desktop)
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;

  // Mobile menu state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      // Initial state - sidebar closed on mobile by default
      isSidebarOpen: false,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,

      // Sidebar actions (mobile)
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),

      // Sidebar collapse actions (desktop)
      toggleSidebarCollapse: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      // Mobile menu actions
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: "layout-storage", // localStorage key
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed, // Only persist collapsed state
      }),
    }
  )
);

/**
 * USAGE EXAMPLES:
 *
 * // In a component
 * const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayoutStore();
 *
 * // Toggle sidebar
 * <button onClick={toggleSidebar}>Toggle</button>
 *
 * // Check state
 * {isSidebarOpen && <Sidebar />}
 *
 * // Close sidebar
 * <button onClick={closeSidebar}>Close</button>
 *
 * WHEN EXTENDING:
 * - Add new state properties
 * - Add corresponding actions
 * - Update partialize if state should persist
 * - Keep actions simple and focused
 */
