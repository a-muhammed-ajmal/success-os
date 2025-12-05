import { useState, useEffect } from 'react';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { getTasks, updateTask, createTask } from '../services/tasksService';
import type { Task, TaskPriority } from '../types/database';

type SortOption = 'due_date' | 'created_at' | 'alphabetical' | 'project' | 'priority';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('due_date');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createTask(taskData);
    setShowAddModal(false);
    loadTasks();
  };

  const handleUpdateTask = async (task: Task, updates: Partial<Task>) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, ...updates } : t));
    try {
      await updateTask(task.id, updates);
      loadTasks(); // Sync
    } catch (error) {
      console.error('Error updating task:', error);
      loadTasks(); // Revert
    }
  };

  /* const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      loadTasks();
    }
  }; */

  const getSortedTasks = () => {
    let result = [...tasks];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.project?.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'project':
          return (a.project || '').localeCompare(b.project || '');
        case 'priority':
          const priorityOrder: Record<TaskPriority, number> = { 'P1': 1, 'P2': 2, 'P3': 3, 'P4': 4 };
          // Unknown priorities fallback
          const pA = priorityOrder[a.priority] || 99;
          const pB = priorityOrder[b.priority] || 99;
          return pA - pB;
        default:
          return 0;
      }
    });

    return result;
  };

  const sortedTasks = getSortedTasks();

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Priorities & Backlog</h1>
          <p className="text-gray-500 text-sm">Manage and organize your master task list</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks, projects, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown size={14} /> Sort by:
          </span>
          {(['due_date', 'priority', 'project', 'alphabetical', 'created_at'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap transition-colors ${
                sortBy === option
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading tasks...</div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">No tasks found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-primary font-medium hover:underline"
            >
              Create your first task
            </button>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group ${
                task.status === 'Done' ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                 <button
                  onClick={() => handleUpdateTask(task, { status: task.status === 'Done' ? 'Todo' : 'Done' })}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.status === 'Done'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {task.status === 'Done' && <Plus size={12} className="rotate-45" />}
                </button>

                <div className="flex-1 min-w-0" onClick={() => { setEditingTask(task); setShowAddModal(true); }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-medium text-gray-900 truncate ${task.status === 'Done' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {task.priority === 'P1' && <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded font-bold">P1</span>}
                      {task.priority === 'P2' && <span className="bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded font-bold">P2</span>}
                      {task.priority === 'P3' && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded font-bold">P3</span>}
                      {task.priority === 'P4' && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-bold">P4</span>}
                      {task.is_focus_task && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-medium">Focus</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    {task.project && (
                      <span className="flex items-center gap-1">
                         📁 {task.project}
                      </span>
                    )}
                    {task.due_date && (
                      <span className={`flex items-center gap-1 ${
                        new Date(task.due_date) < new Date() && task.status !== 'Done' ? 'text-red-500 font-medium' : ''
                      }`}>
                         📅 {new Date(task.due_date).toLocaleDateString()} {task.due_time || ''}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                         🏷️ {task.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(null);
        }}
        onSave={handleAddTask}
        initialData={editingTask}
      />
    </div>
  );
}
