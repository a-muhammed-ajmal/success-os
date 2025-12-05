import { useState } from 'react';
import MobileNavigation from './components/navigation/MobileNavigation';
import DesktopSidebar from './components/navigation/DesktopSidebar';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';
import FABMenu from './components/ui/FABMenu';

function App() {
  const [currentPage, setCurrentPage] = useState('overview');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
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
        return <div className="p-4">Priorities (Coming Soon)</div>;
      case 'reviews':
        return <div className="p-4">Reviews (Coming Soon)</div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesktopSidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>

      <MobileNavigation currentPage={currentPage} onNavigate={handleNavigate} />

      <FABMenu
        onAddTask={() => console.log('Add Task')}
        onAddLead={() => console.log('Add Lead')}
        onAddIncome={() => console.log('Add Income')}
        onAddExpense={() => console.log('Add Expense')}
        onAddNote={() => console.log('Add Note')}
      />
    </div>
  );
}

export default App;
