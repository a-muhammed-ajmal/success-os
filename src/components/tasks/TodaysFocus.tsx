import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus, AlertCircle } from 'lucide-react';
import { getFocusTasks, updateTask, resetDailyFocus } from '../../services/tasksService';
import type { Task } from '../../types/database';

interface TodaysFocusProps {
  onAddTask: () => void;
}

export default function TodaysFocus({ onAddTask }: TodaysFocusProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFocusTasks();
  }, []);

  const loadFocusTasks = async () => {
    try {
      // Check for midnight reset first
      await resetDailyFocus();
      const data = await getFocusTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading focus tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task: Task) => {
    // Optimistic update
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, status: (t.status === 'Done' ? 'Todo' : 'Done') as any } : t
    );
    setTasks(updatedTasks);

    try {
      await updateTask(task.id, {
        status: (task.status === 'Done' ? 'Todo' : 'Done') as any
      });
      // Reload to ensure sync
      loadFocusTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert optimism
      loadFocusTasks();
    }
  };

  if (loading) {
    return <div className="h-48 animate-pulse bg-gray-100 rounded-xl"></div>;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Today's Focus
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {tasks.length}/3
          </span>
        </h2>
        {tasks.length < 3 && (
          <button
            onClick={onAddTask}
            className="text-primary hover:bg-primary/5 p-1 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-2xl font-light text-gray-400 mb-2">
              What are your 3 non-negotiables today?
            </p>
            <button
              onClick={onAddTask}
              className="text-primary font-medium hover:underline text-lg"
            >
              Add Focus Task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`
                group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                ${task.status === 'Done'
                  ? 'bg-gray-50 border-gray-100 opacity-60'
                  : 'bg-white border-gray-200 hover:border-primary/50 hover:shadow-md'
                }
              `}
            >
              <button
                onClick={() => toggleTask(task)}
                className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${task.status === 'Done' ? 'text-green-500' : 'text-gray-300 group-hover:text-primary'}
                `}
              >
                {task.status === 'Done' ? (
                  <CheckCircle className="w-8 h-8 fill-current" />
                ) : (
                  <Circle className="w-8 h-8 stroke-2" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <h3 className={`
                  text-lg md:text-xl font-medium truncate
                  ${task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'}
                `}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 truncate mt-1">{task.description}</p>
                )}
              </div>

              {task.priority === 'P1' && (
                <div className="flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                    <AlertCircle className="w-3 h-3" /> P1
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
