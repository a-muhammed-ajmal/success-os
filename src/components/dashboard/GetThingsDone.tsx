import type { Task } from '../../types/database';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';

interface GetThingsDoneProps {
  tasks: Task[];
  onViewMore: () => void;
  onTaskToggle: (taskId: number) => void;
}

export default function GetThingsDone({ tasks, onViewMore, onTaskToggle }: GetThingsDoneProps) {
  // Filter and sort: get first 10 tasks, sorted by due date (urgent first)
  const priorityTasks = tasks
    .filter(t => t.priority !== 'Focus' && t.status !== 'Done')
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 10);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mb-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-semibold text-gray-900">
          Get Things Done
        </h2>
        <button
          onClick={onViewMore}
          className="text-xs text-primary hover:underline"
        >
          View More →
        </button>
      </div>

      {priorityTasks.length === 0 ? (
        <p className="text-xs md:text-sm text-gray-500 text-center py-4">
          No tasks yet. Start adding your priorities!
        </p>
      ) : (
        <div className="space-y-1.5">
          {priorityTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskToggle(task.id)}
              className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors text-left"
            >
              {task.status === 'Done' ? (
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              ) : (
                <Circle size={16} className="text-gray-400 flex-shrink-0" />
              )}
              <span className="flex-1 text-xs md:text-sm text-gray-900 truncate">
                {task.title}
              </span>
              {task.due_date && (
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Calendar size={12} />
                  {formatDate(task.due_date)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
