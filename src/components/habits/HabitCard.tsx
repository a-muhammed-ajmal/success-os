import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Habit } from '@/types';
import { CheckCircle2, Flame, Target } from 'lucide-react';
import React from 'react';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  onToggleCompletion?: (habitId: string, date: string) => void;
  todayCompletion?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onDelete,
  onToggleCompletion,
  todayCompletion = false,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const completionRate = habit.completed_days > 0 ?
    Math.min((habit.completed_days / Math.max(habit.target_days || 7, 1)) * 100, 100) : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {habit.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {habit.streak > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {habit.streak}
              </Badge>
            )}
            <Badge variant="outline">
              {habit.frequency}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {habit.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {habit.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{habit.completed_days} / {habit.target_days || 7} days</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{habit.target_days || 7} days/week</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className={`h-4 w-4 ${todayCompletion ? 'text-green-500' : 'text-gray-400'}`} />
              <span>Today</span>
            </div>
          </div>

          {onToggleCompletion && (
            <Button
              variant={todayCompletion ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleCompletion(habit.id, today)}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {todayCompletion ? 'Done' : 'Mark Done'}
            </Button>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(habit)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(habit.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
