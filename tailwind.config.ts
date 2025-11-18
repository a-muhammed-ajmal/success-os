import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#27272a",
        input: "#27272a",
        ring: "#6366f1",
        background: {
          DEFAULT: "#0a0a0b",
          secondary: "#141416",
          tertiary: "#1c1c1f",
          elevated: "#27272a",
        },
        foreground: {
          DEFAULT: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#71717a",
          disabled: "#52525b",
        },
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#818cf8",
          dark: "#4338ca",
          foreground: "#ffffff",
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
        finance: "#10b981",
        business: "#f97316",
        tasks: "#a855f7",
        habits: "#06b6d4",
        relationship: "#ec4899",
        mindset: "#8b5cf6",
        planning: "#3b82f6",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;

/**
 * BLACKBOX AI INSTRUCTIONS:
 * 
 * This is the Tailwind configuration for Success OS.
 * 
 * KEY FEATURES:
 * - Dark theme with custom background colors (#0a0a0b, #141416, #1c1c1f)
 * - Primary brand color: Indigo (#6366f1)
 * - Feature-specific colors for each section
 * - Custom spacing system (8, 12, 16, 20, 24)
 * - Border radius system (10-16px range)
 * - Custom animations (fadeIn, slideUp, slideDown, scaleIn)
 * 
 * USAGE:
 * - Use bg-background for main backgrounds
 * - Use bg-background-secondary for cards
 * - Use text-foreground for primary text
 * - Use text-foreground-secondary for secondary text
 * 
 * WHEN MODIFYING:
 * - Keep the dark theme aesthetic
 * - Maintain consistent spacing system
 * - Use feature colors for section-specific UI
 * - Test color contrast for accessibility
 */
