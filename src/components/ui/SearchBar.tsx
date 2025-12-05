import { Search, Plus } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onAdd: () => void;
  addButtonText: string;
}

export default function SearchBar({ placeholder = 'Search...', onSearch, onAdd, addButtonText }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{addButtonText}</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
}
