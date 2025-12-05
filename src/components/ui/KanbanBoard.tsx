import type { ReactNode } from 'react';

interface KanbanColumn {
  id: string;
  title: string;
  items: any[];
  renderCard: (item: any) => ReactNode;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardClick?: (item: any) => void;
}

export default function KanbanBoard({ columns, onCardClick }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-72">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">{column.title}</h3>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {column.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {column.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onCardClick?.(item)}
                >
                  {column.renderCard(item)}
                </div>
              ))}
              {column.items.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No items
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
