import { useState, useEffect } from 'react';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import KickstartQuotes from '../components/dashboard/KickstartQuotes';
import DashboardKPICards from '../components/dashboard/DashboardKPICards';
import TodaysFocus from '../components/tasks/TodaysFocus';
import WinnersMindset from '../components/dashboard/WinnersMindset';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { createTask } from '../services/tasksService';
import { getDashboardStats } from '../services/dashboardService';
import type { Task } from '../types/database';

export default function DashboardPage() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stats, setStats] = useState({
    dealsProcessing: 0,
    daysRemaining: 0,
    doneSuccessfully: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createTask(taskData);
    setShowAddTaskModal(false);
    window.location.reload();
  };

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6">
      <GreetingHeader userName="Ajmal" />
      <KickstartQuotes />
      <DashboardKPICards
        dealsProcessing={stats.dealsProcessing}
        daysRemaining={stats.daysRemaining}
        doneSuccessfully={stats.doneSuccessfully}
      />

      <div className="mb-8">
        <TodaysFocus
          onAddTask={() => {
            setEditingTask(null);
            setShowAddTaskModal(true);
          }}
        />
      </div>

      <WinnersMindset />

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => {
          setShowAddTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleAddTask}
        initialData={editingTask}
      />
    </div>
  );
}
