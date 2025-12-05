import { useState } from 'react';
import { Plus, X, CheckSquare, Users, DollarSign, CreditCard, StickyNote } from 'lucide-react';

interface FABMenuProps {
  onAddTask: () => void;
  onAddLead: () => void;
  onAddIncome: () => void;
  onAddExpense: () => void;
  onAddNote: () => void;
}

export default function FABMenu({
  onAddTask,
  onAddLead,
  onAddIncome,
  onAddExpense,
  onAddNote
}: FABMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: CheckSquare, label: 'Add Task', onClick: onAddTask },
    { icon: Users, label: 'Add Lead', onClick: onAddLead },
    { icon: DollarSign, label: 'Add Income', onClick: onAddIncome },
    { icon: CreditCard, label: 'Add Expense', onClick: onAddExpense },
    { icon: StickyNote, label: 'Add Note', onClick: onAddNote },
  ];

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
      {/* Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item.onClick)}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all animate-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon size={18} className="text-primary" />
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}
