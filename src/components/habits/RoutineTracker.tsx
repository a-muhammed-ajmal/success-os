'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useHabitStore } from '@/store/habitStore';
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { HabitRow } from './HabitRow';

export function RoutineTracker() {
  const { habits, completions, toggleHabitCompletion, selectedDate, setSelectedDate } = useHabitStore();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeek);
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const morningHabits = habits.filter(h => h.routine_type === 'morning');
  const workHabits = habits.filter(h => h.routine_type === 'work');
  const eveningHabits = habits.filter(h => h.routine_type === 'evening');
  const dailyHabits = habits.filter(h => h.routine_type === 'daily');

  const renderRoutineSection = (title: string, habits: any[], color: string) => {
    if (habits.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className={cn('text-lg font-semibold', color)}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                weekDays={weekDays}
                completions={completions}
                onToggle={toggleHabitCompletion}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateWeek('prev')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </h2>
          <Button variant="link" onClick={goToToday} className="text-sm">
            Go to Today
          </Button>
        </div>
        <Button variant="outline" onClick={() => navigateWeek('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-8 gap-2 text-center text-sm font-medium text-foreground-muted">
        <div className="col-span-2 md:col-span-3">Habit</div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="aspect-square flex flex-col items-center justify-center">
            <div className="text-xs">{format(day, 'EEE')}</div>
            <div className="text-lg font-bold">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Routine Sections */}
      {renderRoutineSection('Morning Routine', morningHabits, 'text-orange-500')}
      {renderRoutineSection('Work Routine', workHabits, 'text-blue-500')}
      {renderRoutineSection('Evening Routine', eveningHabits, 'text-purple-500')}
      {renderRoutineSection('Daily Habits', dailyHabits, 'text-green-500')}

      {habits.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-foreground-muted">No habits created yet. Add your first habit to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
