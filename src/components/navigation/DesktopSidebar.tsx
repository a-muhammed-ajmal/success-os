import { Home, Briefcase, DollarSign, Heart, Users, Target, CheckSquare, BarChart3 } from 'lucide-react';

interface DesktopSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isExpanded?: boolean;
}

export default function DesktopSidebar({ currentPage, onNavigate, isExpanded = true }: DesktopSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'relationship', label: 'Relationship', icon: Users },
    { id: 'visions', label: 'Visions', icon: Target },
    { id: 'priorities', label: 'Priorities', icon: CheckSquare },
    { id: 'reviews', label: 'Reviews', icon: BarChart3 },
  ];

  return (
    <aside
      className={`hidden md:flex md:flex-col bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${
        isExpanded ? 'w-56' : 'w-20'
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className={`font-bold text-primary transition-all ${isExpanded ? 'text-xl' : 'text-sm text-center'}`}>
          {isExpanded ? 'My Success OS' : 'MS'}
        </h1>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border-r-4 border-primary'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {isExpanded && <span className="text-xs font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
