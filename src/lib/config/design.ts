import {
    Activity,
    Brain,
    Briefcase,
    Calendar,
    CheckSquare,
    DollarSign,
    Heart,
    LayoutDashboard,
    type LucideIcon,
} from "lucide-react";

/**
 * BLACKBOX AI INSTRUCTIONS:
 *
 * This file contains all design constants for Success OS.
 *
 * SIDEBAR_SECTIONS: Navigation structure for the app
 * - Each section has: id, title, icon (Lucide), href, color
 * - Colors match feature-specific colors in tailwind.config.ts
 *
 * APP_SPACING: Consistent spacing values (8, 12, 16, 20, 24)
 * - Use these for margins, paddings, gaps
 *
 * COLORS: Main color palette
 * - Backgrounds: Dark theme (#0a0a0b, #141416, #1c1c1f)
 * - Text: Light colors for contrast
 * - Accent: Feature-specific colors
 *
 * WHEN ADDING NEW SECTIONS:
 * 1. Add to SIDEBAR_SECTIONS array
 * 2. Import corresponding Lucide icon
 * 3. Choose a unique color from COLORS.accent
 * 4. Create the route in app/(main)/[section-name]/page.tsx
 */

export interface SidebarSection {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: "command-center",
    title: "Command Center",
    icon: LayoutDashboard,
    href: "/",
    color: "#6366f1", // Primary
  },
  {
    id: "business",
    title: "Business & Sales",
    icon: Briefcase,
    href: "/business",
    color: "#f97316", // Orange
  },
  {
    id: "tasks",
    title: "Projected Tasks",
    icon: CheckSquare,
    href: "/tasks",
    color: "#a855f7", // Purple
  },
  {
    id: "finance",
    title: "Financial Dashboard",
    icon: DollarSign,
    href: "/finance",
    color: "#10b981", // Green
  },
  {
    id: "relationship",
    title: "Relationship",
    icon: Heart,
    href: "/relationship",
    color: "#ec4899", // Pink
  },
  {
    id: "habits",
    title: "Life & Health",
    icon: Activity,
    href: "/habits",
    color: "#06b6d4", // Cyan
  },
  {
    id: "mindset",
    title: "Mind & Growth",
    icon: Brain,
    href: "/mindset",
    color: "#8b5cf6", // Purple
  },
  {
    id: "planning",
    title: "Planning & Reflection",
    icon: Calendar,
    href: "/planning",
    color: "#3b82f6", // Blue
  },
];

export const APP_SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const COLORS = {
  background: {
    primary: "#0a0a0b",
    secondary: "#141416",
    tertiary: "#1c1c1f",
    elevated: "#27272a",
  },
  foreground: {
    primary: "#fafafa",
    secondary: "#a1a1aa",
    muted: "#71717a",
    disabled: "#52525b",
  },
  brand: {
    primary: "#6366f1",
    hover: "#4f46e5",
    light: "#818cf8",
    dark: "#4338ca",
  },
  accent: {
    green: "#10b981",
    red: "#ef4444",
    yellow: "#f59e0b",
    blue: "#3b82f6",
    purple: "#a855f7",
    pink: "#ec4899",
    orange: "#f97316",
    cyan: "#06b6d4",
  },
  border: {
    DEFAULT: "#27272a",
    hover: "#3f3f46",
  },
} as const;

export const BORDER_RADIUS = {
  sm: "0.5rem", // 8px
  md: "0.625rem", // 10px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
} as const;

/**
 * USAGE EXAMPLES:
 *
 * // Import in components
 * import { SIDEBAR_SECTIONS, APP_SPACING, COLORS } from ''lib/config/design'' (see below for file content);
 *
 * // Use sidebar sections
 * SIDEBAR_SECTIONS.map(section => ...)
 *
 * // Use spacing
 * <div className={`p-${APP_SPACING.md}`}>
 *
 * // Use colors
 * style={{ backgroundColor: COLORS.background.secondary }}
 */
