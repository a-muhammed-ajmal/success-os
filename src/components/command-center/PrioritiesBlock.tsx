'use client';

import { Button } from 'components/ui/button';
import { useEffect, useState } from 'react';
import { commandCenterService } from 'src/services/commandCenterService';
import type { Task } from 'src/types';

export function PrioritiesBlock() {
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUrgentTasks();
  }, []);

  const loadUrgentTasks = async () => {
    try {
      const tasks = await commandCenterService.getUrgentTasks();
      setUrgentTasks(tasks);
    } catch (error) {
      console.error('Error loading urgent tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await commandCenterService.completeTask(taskId);
      await loadUrgentTasks(); // Refresh the list
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Priorities</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Priorities</h3>
      {urgentTasks.length === 0 ? (
        <p className="text-foreground-muted text-sm">No urgent tasks at the moment. Great job!</p>
      ) : (
        <div className="space-y-3">
          {urgentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-foreground-muted mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span className="text-xs text-foreground-muted">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={() => handleCompleteTask(task.id)}
                size="sm"
                className="ml-4"
              >
                Complete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
