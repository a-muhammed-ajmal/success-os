'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface Habit {
  id: string;
  name: string;
  color: string;
  completions: boolean[];
}

const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    color: '#f59e0b',
    completions: [true, true, false, true, true, false, false],
  },
  {
    id: '2',
    name: 'Exercise',
    color: '#10b981',
    completions: [true, false, true, true, false, true, false],
  },
  {
    id: '3',
    name: 'Read for 30min',
    color: '#8b5cf6',
    completions: [true, true, true, false, true, true, true],
  },
];

export function HabitGrid() {
  const [habits, setHabits] = useState(mockHabits);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleCompletion = (habitId: string, dayIndex: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completions: habit.completions.map((c, i) =>
                i === dayIndex ? !c : c
              ),
            }
          : habit
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="col-span-2"></div>
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-foreground-secondary"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          {habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
              <div className="col-span-2 flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="text-sm font-medium text-foreground truncate">
                  {habit.name}
                </span>
              </div>
              {habit.completions.map((completed, index) => (
                <button
                  key={index}
                  onClick={() => toggleCompletion(habit.id, index)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                    completed
                      ? 'bg-primary border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {completed && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}