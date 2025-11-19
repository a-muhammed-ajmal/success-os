'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface LeadsWidgetProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function LeadsWidget({ title, count, icon: Icon, color, onClick }: LeadsWidgetProps) {
  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </Card>
  );
}
