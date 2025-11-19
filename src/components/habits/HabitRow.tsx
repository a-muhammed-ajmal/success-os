'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types';
import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface HabitRowProps {
  habit: Habit;
  weekDays: Date[];
  completions: Record<string, boolean>; // map of `${habitId}-${dateString}` -> boolean
  onToggle: (habitId: string, date: Date) => void;
}

const routineColors: Record<string, string> = {
  morning: 'bg-orange-500/10 text-orange-400',
  work: 'bg-blue-500/10 text-blue-400',
  evening: 'bg-purple-500/10 text-purple-400',
  daily: 'bg-green-500/10 text-green-400',
  custom: 'bg-gray-500/10 text-gray-400',
};

export function HabitRow({ habit, weekDays, completions, onToggle }: HabitRowProps) {
  const getCompletionKey = (habitId: string, date: Date) => {
    return `${habitId}-${format(date, 'yyyy-MM-dd')}`;
  };

  const completedCount = weekDays.filter((day) =>
    completions[getCompletionKey(habit.id, day)]
  ).length;

  return (
    <div className="bg-background-secondary border border-border rounded-lg p-3 hover:border-primary/50 transition-all">
      <div className="grid grid-cols-8 gap-2 items-center">
        {/* Habit Info */}
        <div className="col-span-2 md:col-span-3 flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{habit.name}</p>
            {habit.routine_type && (
              <Badge className={cn(`${routineColors[habit.routine_type]} text-xs mt-1`)}>
                {habit.routine_type}
              </Badge>
            )}
          </div>
          <span className="text-xs text-foreground-muted font-medium">
            {completedCount}/{weekDays.length}
          </span>
        </div>

        {/* Checkboxes */}
        {weekDays.map((day) => {
          const key = getCompletionKey(habit.id, day);
          const isCompleted = completions[key] || false;
          const isToday = isSameDay(day, new Date());

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => onToggle(habit.id, day)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'aspect-square rounded-lg border-2 flex items-center justify-center transition-all',
                isCompleted
                  ? 'bg-primary border-primary'
                  : isToday
                  ? 'border-primary/50 hover:border-primary'
                  : 'border-border hover:border-border-hover'
              )}
            >
              {isCompleted && <Check className="w-4 h-4 text-white" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
