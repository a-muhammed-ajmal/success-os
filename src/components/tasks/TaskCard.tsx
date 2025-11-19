'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Flag, MoreVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  project?: {
    name: string;
    color: string;
  };
}

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onComplete?: () => void;
}

const priorityColors = {
  low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function TaskCard({ task, onEdit, onComplete }: TaskCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-all group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {task.project && (
              <Badge
                style={{
                  backgroundColor: `${task.project.color}20`,
                  color: task.project.color,
                  borderColor: `${task.project.color}40`,
                }}
                className="text-xs border"
              >
                {task.project.name}
              </Badge>
            )}
            <Badge className={priorityColors[task.priority]}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
            onClick={onEdit}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <Calendar className="w-4 h-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.status !== 'completed' && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full"
            onClick={onComplete}
          >
            Mark Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}