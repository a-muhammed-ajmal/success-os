// app/(main)/layout.tsx
import { MainLayout } from "@/components/layout/MainLayout"; // CORRECTED: Using the @/ alias

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
