// src/components/command-center/PrioritiesBlock.tsx
'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; // CORRECTED
import { SectionHeader } from '@/components/shared/SectionHeader'; // CORRECTED
import { Button } from '@/components/ui/button'; // CORRECTED
import { cn } from '@/lib/utils'; // CORRECTED
import { commandCenterService } from '@/services/commandCenterService'; // CORRECTED
import type { Task } from '@/types'; // CORRECTED
import { differenceInDays, format } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PrioritiesBlockProps {
  // Add any props if needed
}

export function PrioritiesBlock({}: PrioritiesBlockProps) {
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrgentTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commandCenterService.getUrgentTasks();
      setUrgentTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrgentTasks();
  }, []);

  const handleCompleteTask = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await commandCenterService.completeTask(taskId);
      setUrgentTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-background-secondary p-6 rounded-lg shadow-sm h-full flex flex-col">
      <SectionHeader title="Priorities" description="Your most urgent tasks." className="mb-4" />

      {urgentTasks.length === 0 ? (
        <p className="text-foreground-muted flex-grow">No urgent tasks right now. Great job!</p>
      ) : (
        <div className="space-y-4 flex-grow">
          {urgentTasks.map((task) => {
            const daysRemaining = task.due_date ? differenceInDays(new Date(task.due_date), new Date()) : null;
            const isOverdue = daysRemaining !== null && daysRemaining < 0;

            return (
              <div key={task.id} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-3 h-3 rounded-full",
                    task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  )} />
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.due_date && (
                      <p className={cn("text-sm text-foreground-muted flex items-center gap-1 mt-1", isOverdue && "text-red-400")}>
                        {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        Due: {format(new Date(task.due_date), 'MMM dd')}
                        {daysRemaining !== null && (
                          <span className="ml-1">({isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCompleteTask(task.id)} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-green-400" />}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <Button variant="secondary" className="mt-6" onClick={fetchUrgentTasks} disabled={isLoading}>
        Refresh Priorities
      </Button>
    </div>
  );
}
