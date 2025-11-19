// src/components/business/LeadCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { useBusinessStore } from '@/store/businessStore';
import type { Lead } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, CheckCircle, DollarSign, Edit2, GripVertical, Trash2 } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  isDragging?: boolean;
}

export function LeadCard({ lead, onEdit, onDelete, isDragging = false }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const { convertLeadToClient } = useBusinessStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleConvert = async () => {
    if (window.confirm(`Convert "${lead.name}" to a client?`)) {
      await convertLeadToClient(lead.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-background-tertiary border border-border rounded-lg p-3 group hover:border-primary/50 transition-all',
        isDragging ? 'shadow-lg' : ''
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          className="mt-1 cursor-grab active:cursor-grabbing text-foreground-muted hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          {/* Lead Name */}
          <h4 className="font-semibold text-foreground truncate mb-1">
            {lead.name}
          </h4>

          {/* Company */}
          {lead.company && (
            <div className="flex items-center gap-1 text-sm text-foreground-secondary mb-2">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{lead.company}</span>
            </div>
          )}

          {/* Product Interest */}
          {lead.product_interest && (
            <p className="text-xs text-foreground-muted mb-2 line-clamp-1">
              {lead.product_interest}
            </p>
          )}

          {/* Next Step */}
          {lead.next_step && (
            <p className="text-xs text-primary mb-2">
              Next: {lead.next_step}
            </p>
          )}

          {/* Value */}
          {lead.value !== null && lead.value !== undefined && (
            <div className="flex items-center gap-1 text-sm font-medium text-green-400">
              <DollarSign className="w-3 h-3" />
              <span>{formatCurrency(lead.value)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {lead.stage !== 'approved' && lead.stage !== 'rejected' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleConvert}
              className="h-7 w-7 p-0 text-green-400 hover:text-green-300"
              title="Convert to Client"
            >
              <CheckCircle className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lead)}
            className="h-7 w-7 p-0"
            title="Edit Lead"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(lead.id)}
            className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
            title="Delete Lead"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
