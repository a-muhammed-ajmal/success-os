'use client';

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Lead, LeadStage } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';

const stages: LeadStage[] = ['new', 'contacted', 'meeting', 'submitted', 'approved', 'rejected'];

const stageLabels = {
  new: 'New',
  contacted: 'Contacted',
  meeting: 'Meeting',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
};

interface KanbanBoardProps {
  leads: Lead[];
  onUpdateStage: (leadId: string, stage: LeadStage) => Promise<void>;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export function KanbanBoard({ leads, onUpdateStage, onEditLead, onDeleteLead }: KanbanBoardProps) {
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const groupedLeads = stages.reduce((acc, stage) => {
    acc[stage] = leads.filter((lead) => lead.stage === stage);
    return acc;
  }, {} as Record<LeadStage, Lead[]>);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const lead = leads.find((l) => l.id === active.id);
    setActiveLead(lead || null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLead = leads.find((l) => l.id === activeId);
    if (!activeLead) return;

    const overLead = leads.find((l) => l.id === overId);
    if (!overLead) return;

    if (activeLead.stage !== overLead.stage) {
      // Moving to different column
      const newStage = overLead.stage;
      onUpdateStage(activeId, newStage);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeLead = leads.find((l) => l.id === activeId);
    const overLead = leads.find((l) => l.id === overId);

    if (!activeLead || !overLead) return;

    if (activeLead.stage === overLead.stage) {
      // Reordering within same column
      const stage = activeLead.stage;
      const leadsInStage = groupedLeads[stage];
      const oldIndex = leadsInStage.findIndex((l) => l.id === activeId);
      const newIndex = leadsInStage.findIndex((l) => l.id === overId);

      const reorderedLeads = arrayMove(leadsInStage, oldIndex, newIndex);
      // Note: For simplicity, we're not persisting the order in this example
      // In a real app, you'd update the order in the backend
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            id={stage}
            title={stageLabels[stage]}
            leads={groupedLeads[stage]}
            onEditLead={onEditLead}
            onDeleteLead={onDeleteLead}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <LeadCard
            lead={activeLead}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
