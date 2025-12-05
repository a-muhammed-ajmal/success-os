import { useState } from 'react';
import MobileNavigation from './components/navigation/MobileNavigation';
import DesktopSidebar from './components/navigation/DesktopSidebar';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';
import TasksPage from './pages/TasksPage';
import FABMenu from './components/ui/FABMenu';
import AddTaskModal from './components/tasks/AddTaskModal';
import { createTask } from './services/tasksService';
import type { Task } from './types/database';

function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [showGlobalAddModal, setShowGlobalAddModal] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleGlobalAddTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createTask(taskData);
    setShowGlobalAddModal(false);
    // Force reload to update all views (Dashboard/Tasks) with new data
    // This is a simple solution for the MVP to ensure consistency
    window.location.reload();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <DashboardPage />;
      case 'professional':
        return <BusinessPage />;
      case 'finance':
        return <div className="p-4">Finance (Coming Soon)</div>;
      case 'wellness':
        return <div className="p-4">Wellness (Coming Soon)</div>;
      case 'relationship':
        return <div className="p-4">Relationship (Coming Soon)</div>;
      case 'visions':
        return <div className="p-4">Visions (Coming Soon)</div>;
      case 'priorities':
        return <TasksPage />;
      case 'reviews':
        return <div className="p-4">Reviews (Coming Soon)</div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesktopSidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {renderPage()}
      </main>

      <MobileNavigation currentPage={currentPage} onNavigate={handleNavigate} />

      <FABMenu
        onAddTask={() => setShowGlobalAddModal(true)}
        onAddLead={() => {
          setCurrentPage('professional');
          // In a future update, we can use a context or query param to auto-open the Add Modal
          // For now, navigating to the leads page is the expected behavior
          window.scrollTo(0, 0);
        }}
        onAddIncome={() => {
          // Future: Open Add Income Modal
          console.log('Add Income');
        }}
        onAddExpense={() => {
          // Future: Open Add Expense Modal
          console.log('Add Expense');
        }}
        onAddNote={() => {
           // Future: Open Add Note Modal
           console.log('Add Note');
        }}
      />

      <AddTaskModal
        isOpen={showGlobalAddModal}
        onClose={() => setShowGlobalAddModal(false)}
        onSave={handleGlobalAddTask}
      />
    </div>
  );
}

export default App;
