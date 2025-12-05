import { useState } from 'react';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import KickstartQuotes from '../components/dashboard/KickstartQuotes';
import DashboardKPICards from '../components/dashboard/DashboardKPICards';
import TodaysFocus from '../components/tasks/TodaysFocus'; // New component
import WinnersMindset from '../components/dashboard/WinnersMindset';
// import GetThingsDone from '../components/dashboard/GetThingsDone'; // Disabling for now or updating later
import AddTaskModal from '../components/tasks/AddTaskModal';
import { createTask } from '../services/tasksService';
import type { Task } from '../types/database';

export default function DashboardPage() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createTask(taskData);
    setShowAddTaskModal(false);
    // Ideally trigger a refresh in TodaysFocus, but it fetches on mount/update logic.
    // Since TodaysFocus loads its own data, we might need a context or signal to refresh it.
    // For now, simple page reload or window event could work, or we lift state up.
    // Given the component structure, lifting state is better but TodaysFocus is self-contained.
    // I'll make TodaysFocus accept a 'refreshTrigger' prop or similar, or just force reload for MVP.
    window.location.reload(); // Quick fix for MVP to ensure "Today's Focus" updates immediately if a new focus task is added
  };

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6">
      <GreetingHeader userName="Ajmal" />
      <KickstartQuotes />
      <DashboardKPICards
        dealsProcessing={0} // To be connected to real data later
        daysRemaining={0}
        doneSuccessfully={0}
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

      {/* <GetThingsDone /> - Can be re-enabled when updated to use tasksService */}

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
