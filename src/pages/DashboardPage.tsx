import { useState } from 'react';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import KickstartQuotes from '../components/dashboard/KickstartQuotes';
import DashboardKPICards from '../components/dashboard/DashboardKPICards';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import WinnersMindset from '../components/dashboard/WinnersMindset';
import GetThingsDone from '../components/dashboard/GetThingsDone';
import type { Task } from '../types/database';

export default function DashboardPage() {
  // This is demo data - will be replaced with actual Supabase data
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskToggle = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'Done' ? 'Todo' : 'Done' } as Task
        : task
    ));
  };

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6">
      <GreetingHeader userName="Ajmal" />
      <KickstartQuotes />
      <DashboardKPICards
        dealsProcessing={0}
        daysRemaining={0}
        doneSuccessfully={0}
      />
      <TodaysFocus
        tasks={tasks}
        onTaskToggle={handleTaskToggle}
        onAddTask={() => console.log('Add task')}
      />
      <WinnersMindset />
      <GetThingsDone
        tasks={tasks}
        onViewMore={() => console.log('View more')}
        onTaskToggle={handleTaskToggle}
      />
    </div>
  );
}
