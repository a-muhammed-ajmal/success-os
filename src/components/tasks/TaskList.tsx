'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { TaskCard } from './TaskCard';

// Mock data - replace with real data later
const mockTasks = [
  {
    id: '1',
    title: 'Complete Q4 financial review',
    description: 'Analyze all transactions and prepare report',
    priority: 'high' as const,
    status: 'in-progress' as const,
    dueDate: '2025-12-31',
    project: {
      name: 'Finance',
      color: '#10b981',
    },
  },
  {
    id: '2',
    title: 'Update CRM with new leads',
    priority: 'medium' as const,
    status: 'todo' as const,
    dueDate: '2025-11-25',
    project: {
      name: 'Business',
      color: '#f97316',
    },
  },
];

export function TaskList() {
  const [tasks, setTasks] = useState(mockTasks);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground-muted">No tasks found</p>
        </div>
      )}
    </div>
  );
}