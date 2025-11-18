import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          green: "#10b981",
          red: "#ef4444",
          yellow: "#f59e0b",
          blue: "#3b82f6",
          purple: "#a855f7",
          pink: "#ec4899",
          orange: "#f97316",
          cyan: "#06b6d4",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Feature-specific colors
        finance: "#10b981",
        business: "#f97316",
        tasks: "#a855f7",
        habits: "#06b6d4",
        relationship: "#ec4899",
        mindset: "#8b5cf6",
        planning: "#3b82f6",
      },
      spacing: {
        "0.5": "0.125rem", // 2px
        "1.5": "0.375rem", // 6px
        "2.5": "0.625rem", // 10px
        "3.5": "0.875rem", // 14px
        "4.5": "1.125rem", // 18px
        "5.5": "1.375rem", // 22px
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "0.25rem", // 4px
        DEFAULT: "0.5rem", // 8px (10-16px range)
        xl: "1rem", // 16px
        "2xl": "1.5rem", // 24px
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

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
