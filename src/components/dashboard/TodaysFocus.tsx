import type { Task } from '../../types/database';
import { CheckCircle2, Circle } from 'lucide-react';

interface TodaysFocusProps {
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
  onAddTask: () => void;
}

export default function TodaysFocus({ tasks, onTaskToggle, onAddTask }: TodaysFocusProps) {
  const focusTasks = tasks.filter(t => t.is_focus_task).slice(0, 3);

  return (
    <div className="mb-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
      <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
        Today's Focus
      </h2>

      {focusTasks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs md:text-sm text-gray-500 mb-2">
            What are your 3 non-negotiables today?
          </p>
          <button
            onClick={onAddTask}
            className="text-xs md:text-sm text-primary hover:underline"
          >
            Add from backlog →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {focusTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskToggle(task.id)}
              className="w-full flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors text-left"
            >
              {task.status === 'Done' ? (
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm md:text-base ${
                task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-900'
              }`}>
                {task.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {focusTasks.length > 0 && focusTasks.length < 3 && (
        <button
          onClick={onAddTask}
          className="w-full mt-2 text-xs md:text-sm text-gray-500 hover:text-primary transition-colors"
        >
          + Add more ({3 - focusTasks.length} remaining)
        </button>
      )}
    </div>
  );
}
