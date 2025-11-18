# BLACKBOX AI COMPLETE INSTRUCTIONS FOR SUCCESS OS

## PROJECT OVERVIEW
Success OS is a mobile-first personal operating system for managing:
- Sales & Business (CRM)
- Finance (Income/Expense tracking)
- Tasks & Projects
- Habits & Routines
- Relationships
- Mindset & Growth
- Planning & Reflection

## TECH STACK
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Supabase (Database)
- shadcn/ui (Components)
- Lucide Icons

## PHASE 1 COMPLETE ✅
Files created:
1. tailwind.config.ts - Dark theme, custom colors, spacing
2. lib/config/design.ts - Sidebar sections, colors, spacing constants
3. store/layoutStore.ts - Zustand store for sidebar state
4. components/layout/SidebarMenu.tsx - Mobile-first sidebar
5. components/layout/AppHeader.tsx - Top header with search
6. components/layout/MainLayout.tsx - Main layout wrapper
7. app/(main)/layout.tsx - Route group layout
8. app/(main)/page.tsx - Command Center homepage
9. lib/utils.ts - Utility functions (cn)
10. app/globals.css - Global styles
11. app/layout.tsx - Root layout
12. components/ui/button.tsx - Button component
13. .env.local.example - Environment variables template
14. types/index.ts - TypeScript types
15. package.json - Dependencies
16. components.json - shadcn config
17. tsconfig.json - TypeScript config
18. next.config.js - Next.js config
19. postcss.config.js - PostCSS config
20. .gitignore - Git ignore file
21. README.md - Documentation
22-28. All route pages (business, tasks, finance, etc.)

## DESIGN SYSTEM

### Colors
- Background: #0a0a0b (primary), #141416 (secondary), #1c1c1f (tertiary)
- Text: #fafafa (primary), #a1a1aa (secondary), #71717a (muted)
- Primary: #6366f1 (Indigo)
- Feature Colors:
  - Finance: #10b981 (Green)
  - Business: #f97316 (Orange)
  - Tasks: #a855f7 (Purple)
  - Habits: #06b6d4 (Cyan)
  - Relationship: #ec4899 (Pink)
  - Mindset: #8b5cf6 (Purple)
  - Planning: #3b82f6 (Blue)

### Spacing System
- 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Border Radius
- Default: 8px
- Cards: 10-12px
- Buttons: 8px

## FOLDER STRUCTURE

success-os/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Command Center)
│   │   ├── business/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── finance/page.tsx
│   │   ├── relationship/page.tsx
│   │   ├── habits/page.tsx
│   │   ├── mindset/page.tsx
│   │   └── planning/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── SidebarMenu.tsx
│   │   ├── AppHeader.tsx
│   │   └── MainLayout.tsx
│   └── ui/
│       └── button.tsx
├── lib/
│   ├── config/
│   │   └── design.ts
│   └── utils.ts
├── store/
│   └── layoutStore.ts
├── types/
│   └── index.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── package.json
├── components.json
└── .env.local.example

## KEY FEATURES IMPLEMENTED

### 1. Responsive Sidebar
- Mobile: Overlay with backdrop
- Desktop: Fixed 280px width
- Active route highlighting
- Smooth animations

### 2. Header
- Mobile menu toggle
- Search bar (desktop)
- Notifications
- Settings
- User avatar

### 3. Layout System
- Mobile-first design
- Proper spacing for sidebar
- Scrollable content area
- Dark theme throughout

### 4. State Management
- Zustand store for sidebar state
- Persists collapsed state to localStorage
- Separate mobile/desktop states

## NEXT PHASES

### Phase 2: Task Management (Week 2)
- Create taskStore.ts
- Build TaskCard component
- Create TaskList component
- Add TaskFilters component
- Implement task CRUD operations
- Connect to Supabase

### Phase 3: Financial Dashboard (Week 3)
- Create financeStore.ts
- Build MonthlyHealth component
- Create transaction tracking
- Add charts with Recharts
- Implement saving goals

### Phase 4: Business & Sales CRM (Week 4)
- Create businessStore.ts
- Build Kanban board with dnd-kit
- Create CRM components
- Add services library
- Implement lead tracking

### Phase 5: Habits & Relationship (Week 5)
- Create habitStore.ts
- Build habit grid
- Add streak tracking
- Create relationship components
- Implement important dates

### Phase 6: Mindset & Planning (Week 6)
- Create mindsetStore.ts
- Build affirmation carousel
- Create vision board
- Add weekly reviews
- Implement monthly planning

## CODING STANDARDS

### Component Structure
```typescript
"use client"; // Only for client components

import statements...

interface Props {
  // Props with JSDoc comments
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks first
  // State
  // Effects
  // Handlers
  // Render
  return (...)
}
```

### File Naming
- Components: PascalCase (TaskCard.tsx)
- Utilities: camelCase (utils.ts)
- Types: index.ts in types folder
- Pages: page.tsx (Next.js convention)

### Styling
- Use Tailwind classes
- Use cn() utility for conditional classes
- Follow mobile-first approach
- Use design system colors and spacing

### State Management
- Use Zustand for global state
- Use React hooks for local state
- Keep stores focused and small
- Use TypeScript interfaces

## IMPORTANT RULES

- ALWAYS use "use client" for client components
- ALWAYS import from @/ paths
- ALWAYS use TypeScript
- ALWAYS follow mobile-first design
- ALWAYS use design system colors
- ALWAYS add proper TypeScript types
- NEVER break responsive design
- NEVER use inline styles (use Tailwind)
- NEVER skip accessibility features
- NEVER commit without testing

## TESTING CHECKLIST
Before committing:
- Mobile responsive (320px - 768px)
- Tablet responsive (768px - 1024px)
- Desktop responsive (1024px+)
- Dark theme working
- No TypeScript errors
- No console errors
- Sidebar toggles correctly
- Navigation works
- Proper spacing
- Proper colors

## DEPLOYMENT

- Push to GitHub
- Connect to Vercel
- Add environment variables
- Deploy
- Test production build

## SUPPORT

- Documentation: /README.md
- Design System: /lib/config/design.ts
- Types: /types/index.ts
- Examples: All page.tsx files

## VERSION
Phase 1 Complete - v1.0.0
Date: November 18, 2025
