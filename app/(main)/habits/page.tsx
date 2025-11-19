// app/(main)/habits/page.tsx
'use client';

import { HabitEditorModal } from '@/components/habits/HabitEditorModal';
import { HabitGrid } from '@/components/habits/HabitGrid';
import { RoutineTracker } from '@/components/habits/RoutineTracker';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { useHabitStore } from '@/store/habitStore';
import { Habit } from '@/types';
import { Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HabitsPage() {
  const { fetchHabits, fetchCompletions, isLoading, error, selectedDate } = useHabitStore();
  const [isHabitEditorModalOpen, setIsHabitEditorModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    fetchHabits();
    // Fetch completions for a broader range initially, then refine as needed by components
    const start = new Date();
    start.setDate(start.getDate() - 30); // Last 30 days
    const end = new Date();
    end.setDate(end.getDate() + 30); // Next 30 days
    fetchCompletions(start, end);
  }, [fetchHabits, fetchCompletions]);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsHabitEditorModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner className="h-screen" />;
  if (error) return <div className="text-red-500 text-center py-12">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Habits Tracker"
        description="Build consistent routines and track your progress daily."
        actions={
          <div className="flex gap-2">
            <Button onClick={() => { setEditingHabit(null); setIsHabitEditorModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Habit
            </Button>
            <Button variant="secondary" onClick={() => setIsHabitEditorModalOpen(true)}>
              <Settings className="mr-2 h-4 w-4" /> Manage Habits
            </Button>
          </div>
        }
      />

      <RoutineTracker />
      <HabitGrid />
      {/* You can add WeeklyProgress or other habit-related stats here */}

      <HabitEditorModal
        isOpen={isHabitEditorModalOpen}
        onClose={() => { setIsHabitEditorModalOpen(false); setEditingHabit(null); fetchHabits(); }}
        habit={editingHabit}
      />
    </div>
  );
}
