'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Habit } from '@/types';
import { HabitEditor } from './HabitEditor';

interface HabitEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit | null;
}

export function HabitEditorModal({ isOpen, onClose, habit }: HabitEditorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        <HabitEditor habit={habit} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}
