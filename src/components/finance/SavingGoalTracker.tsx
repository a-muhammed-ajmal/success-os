'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon, CheckCircle2, Plus, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn, formatCurrency } from '../../lib/utils';
import { useFinanceStore } from '../../store/financeStore';
import { SavingGoal, SavingGoalPriority } from '../../types';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SavingGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: SavingGoal | null;
}

const SavingGoalForm = ({ isOpen, onClose, goal }: SavingGoalFormProps) => {
  const { addSavingGoal, updateSavingGoal, isLoading, error } = useFinanceStore();
  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(goal?.current_amount.toString() || '0');
  const [deadline, setDeadline] = useState<Date | undefined>(goal?.deadline ? parseISO(goal.deadline) : undefined);
  const [category, setCategory] = useState(goal?.category || 'Other');
  const [priority, setPriority] = useState<SavingGoalPriority>(goal?.priority || 'medium');

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.target_amount.toString());
      setCurrentAmount(goal.current_amount.toString());
      setDeadline(goal.deadline ? parseISO(goal.deadline) : undefined);
      setCategory(goal.category || 'Other');
      setPriority(goal.priority || 'medium');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline(undefined);
      setCategory('Other');
      setPriority('medium');
    }
  }, [goal]);

  const handleSubmit = async () => {
    if (!name || !targetAmount || !deadline) {
      alert('Please fill all required fields: Name, Target Amount, and Deadline.');
      return;
    }

    const goalData: Partial<SavingGoal> = {
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount),
      deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
      category,
      priority,
    };

    if (goal) {
      await updateSavingGoal(goal.id, goalData);
    } else {
      await addSavingGoal(goalData);
    }

    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Saving Goal' : 'Create New Saving Goal'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetAmount" className="text-right">Target Amount</Label>
            <Input id="targetAmount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentAmount" className="text-right">Current Amount</Label>
            <Input id="currentAmount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Vacation">Vacation</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Select value={priority} onValueChange={(value: SavingGoalPriority) => setPriority(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <LoadingSpinner className="h-4 w-4" /> : (goal ? 'Save Changes' : 'Create Goal')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export function SavingGoalTracker() {
  const { savingGoals, isLoading, error, fetchSavingGoals, updateSavingGoal } = useFinanceStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  useEffect(() => {
    fetchSavingGoals();
  }, [fetchSavingGoals]);

  const handleEdit = (goal: SavingGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleCompleteGoal = async (goal: SavingGoal) => {
    if (window.confirm(`Mark "${goal.name}" as completed?`)) {
      await updateSavingGoal(goal.id, { is_completed: true });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const activeGoals = savingGoals.filter(goal => !goal.is_completed);
  const completedGoals = savingGoals.filter(goal => goal.is_completed);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Saving Goals</CardTitle>
        <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          <EmptyState title="No Saving Goals" description="Set up your first saving goal to start tracking progress." />
        ) : (
          <div className="space-y-6">
            {activeGoals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Active Goals</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.map((goal) => {
                    const progress = (goal.current_amount / goal.target_amount) * 100;
                    const daysLeft = goal.deadline ? Math.ceil((parseISO(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

                    return (
                      <Card key={goal.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-foreground text-lg">{goal.name}</h4>
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-foreground-secondary text-sm mb-2">{goal.category}</p>
                        <Progress value={progress} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-foreground-muted mb-3">
                          <span>{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        {daysLeft !== null && (
                          <p className="text-sm text-foreground-secondary">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(goal)}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => handleCompleteGoal(goal)}>Mark Complete</Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Completed Goals</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-70">
                  {completedGoals.map((goal) => (
                    <Card key={goal.id} className="p-4 border-green-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground text-lg">{goal.name}</h4>
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      </div>
                      <p className="text-foreground-secondary text-sm mb-2">{goal.category}</p>
                      <p className="text-green-400 font-medium">{formatCurrency(goal.target_amount)} Achieved!</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <SavingGoalForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} goal={editingGoal} />
    </Card>
  );
}
