// src/components/business/KanbanColumn.tsx
'use client';

import { EmptyState } from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils'; // Aliased import for utils
import type { Lead } from '@/types'; // Aliased import for types
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LeadCard } from './LeadCard'; // Local import for LeadCard

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  leads,
  onEditLead,
  onDeleteLead,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-80">
      <div
        className="bg-background-secondary border border-border rounded-lg p-4"
        style={{ borderTopColor: color, borderTopWidth: '3px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {leads.length}
          </span>
        </div>

        {/* Droppable Area */}
        <SortableContext
          id={id}
          items={leads.map((lead) => lead.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className={cn(
              'space-y-3 min-h-[100px] rounded-lg p-1 -m-1', // Added negative margin and padding for better drag UX
              isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''
            )}
          >
            {leads.length === 0 ? (
              <EmptyState description={`No leads in ${title} stage.`} title="" />
            ) : (
              leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={onEditLead}
                  onDelete={onDeleteLead}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
