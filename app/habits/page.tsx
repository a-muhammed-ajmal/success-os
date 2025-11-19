import { HabitGrid } from '@/components/habits/HabitGrid';

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Habits</h1>
      <HabitGrid />
    </div>
  );
}