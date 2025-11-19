// src/components/habits/HabitEditorModal.tsx
'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useHabitStore } from '@/store/habitStore';
import { Habit, RoutineType } from '@/types';
import { useEffect, useState } from 'react';

interface HabitEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit | null;
}

const routineTypes: RoutineType[] = ['morning', 'work', 'evening', 'daily', 'custom'];
const frequencies = ['daily', 'weekly', 'custom'];
const habitColors = [
  '#f59e0b', // yellow
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#06b6d4', // cyan
];

export function HabitEditorModal({ isOpen, onClose, habit }: HabitEditorModalProps) {
  const { addHabit, updateHabit, isLoading, error } = useHabitStore();

  const [name, setName] = useState(habit?.name || '');
  const [routineType, setRoutineType] = useState<RoutineType | ''>(habit?.routine_type || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState<string>(habit?.target_days_per_week.toString() || '7');
  const [color, setColor] = useState(habit?.color || habitColors[0]);
  const [isActive, setIsActive] = useState(habit?.is_active ?? true);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setRoutineType(habit.routine_type || '');
      setDescription(habit.description || '');
      setFrequency(habit.frequency);
      setTargetDaysPerWeek(habit.target_days_per_week.toString());
      setColor(habit.color);
      setIsActive(habit.is_active);
    } else {
      setName('');
      setRoutineType('');
      setDescription('');
      setFrequency('daily');
      setTargetDaysPerWeek('7');
      setColor(habitColors[0]);
      setIsActive(true);
    }
  }, [habit]);

  const handleSubmit = async () => {
    if (!name || !routineType || !frequency || !targetDaysPerWeek) {
      alert('Please fill in all required fields.');
      return;
    }

    const habitData: Partial<Habit> = {
      name,
      routine_type: routineType,
      description: description || null,
      frequency,
      target_days_per_week: parseInt(targetDaysPerWeek),
      color,
      is_active: isActive,
      order_index: habit?.order_index ?? 0, // Preserve order or set to 0 for new
    };

    if (habit) {
      await updateHabit(habit.id, habitData);
    } else {
      await addHabit(habitData);
    }

    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="routineType" className="text-right">Routine Type</Label>
            <Select value={routineType} onValueChange={(value: RoutineType) => setRoutineType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select routine type" />
              </SelectTrigger>
              <SelectContent>
                {routineTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 min-h-[80px]" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq} className="capitalize">{freq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {frequency !== 'daily' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetDaysPerWeek" className="text-right">Days / Week</Label>
              <Input id="targetDaysPerWeek" type="number" value={targetDaysPerWeek} onChange={(e) => setTargetDaysPerWeek(e.target.value)} className="col-span-3" min="1" max="7" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {habitColors.map((c) => (
                  <SelectItem key={c} value={c}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                      <span>{c}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">Active</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} className="col-span-3" />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <LoadingSpinner className="h-4 w-4" /> : (habit ? 'Save Changes' : 'Add Habit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
