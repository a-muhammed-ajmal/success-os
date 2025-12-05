import type { ReactNode } from 'react';

interface SlimCardProps {
  line1: string;
  line2: string;
  line3: string;
  onClick: () => void;
  quickActions?: ReactNode;
}

export default function SlimCard({ line1, line2, line3, onClick, quickActions }: SlimCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{line1}</h3>
          <p className="text-xs text-gray-600 mt-1 truncate">{line2}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{line3}</p>
        </div>
        {quickActions && (
          <div className="flex-shrink-0 ml-2">
            {quickActions}
          </div>
        )}
      </div>
    </div>
  );
}
