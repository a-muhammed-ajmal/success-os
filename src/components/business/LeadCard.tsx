'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Building, Edit, Mail, Phone, Trash2 } from 'lucide-react';
import { Lead } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface LeadCardProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function LeadCard({ lead, onEdit, onDelete, isDragging }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCardDragging = isDragging || sortableIsDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isCardDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{lead.name}</h4>
            {lead.company && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <Building className="h-3 w-3" />
                {lead.company}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-3 w-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </div>
          )}
        </div>

        {lead.value && (
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            ${lead.value.toLocaleString()}
          </div>
        )}

        {lead.next_step && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Next: {lead.next_step}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {format(new Date(lead.created_at), 'MMM d, yyyy')}
        </div>
      </div>
    </Card>
  );
}
