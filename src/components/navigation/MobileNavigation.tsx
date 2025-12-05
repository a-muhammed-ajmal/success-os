import { Home, Briefcase, DollarSign, Heart, CheckSquare } from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MobileNavigation({ currentPage, onNavigate }: MobileNavigationProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'priorities', label: 'Priorities', icon: CheckSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
              <span className="text-[8px] mt-0.5 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
