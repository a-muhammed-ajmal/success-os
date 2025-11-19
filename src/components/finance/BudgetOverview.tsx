'use client';

import { format } from 'date-fns';
import { Plus, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn, formatCurrency } from '../../lib/utils';
import { useFinanceStore } from '../../store/financeStore';
import { Budget } from '../../types';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
}

const BudgetForm = ({ isOpen, onClose, budget }: BudgetFormProps) => {
  const { setBudget, isLoading, error, selectedMonth, monthlyStats } = useFinanceStore();
  const [category, setCategory] = useState(budget?.category || '');
  const [allocatedAmount, setAllocatedAmount] = useState(budget?.allocated_amount.toString() || '');

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setAllocatedAmount(budget.allocated_amount.toString());
    } else {
      setCategory('');
      setAllocatedAmount('');
    }
  }, [budget]);

  const handleSubmit = async () => {
    if (!category || !allocatedAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    await setBudget(category, parseFloat(allocatedAmount), selectedMonth);

    if (!error) {
      onClose();
    }
  };

  const currentMonthExpenses = monthlyStats.expenseByCategory[category] || 0;
  const existingBudget = useFinanceStore().budgets.find(b => b.category === category && format(new Date(b.month), 'yyyy-MM') === format(selectedMonth, 'yyyy-MM'));
  const spentAmount = existingBudget?.spent_amount || currentMonthExpenses;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Set New Budget'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={!!budget}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(monthlyStats.expenseByCategory).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="allocatedAmount" className="text-right">Allocated Amount</Label>
            <Input id="allocatedAmount" type="number" value={allocatedAmount} onChange={(e) => setAllocatedAmount(e.target.value)} className="col-span-3" required />
          </div>
          {budget && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Spent</Label>
              <span className="col-span-3 text-foreground">{formatCurrency(spentAmount)}</span>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <LoadingSpinner className="h-4 w-4" /> : (budget ? 'Save Changes' : 'Set Budget')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export function BudgetOverview() {
  const { budgets, monthlyStats, isLoading, error, selectedMonth, fetchBudgets } = useFinanceStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets(selectedMonth);
  }, [selectedMonth, fetchBudgets]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const getBudgetStatus = (budget: Budget) => {
    const spent = monthlyStats.expenseByCategory[budget.category] || 0;
    const remaining = budget.allocated_amount - spent;
    const percentage = (spent / budget.allocated_amount) * 100;

    let progressColor = 'bg-primary';
    if (percentage > 100) progressColor = 'bg-red-500';
    else if (percentage > 75) progressColor = 'bg-yellow-500';

    return { spent, remaining, percentage, progressColor };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Budget</CardTitle>
        <Button onClick={() => { setEditingBudget(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Set Budget
        </Button>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <EmptyState title="No Budgets Set" description="Define your monthly budgets to track spending by category." />
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const { spent, remaining, percentage, progressColor } = getBudgetStatus(budget);
              return (
                <Card key={budget.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground text-lg">{budget.category}</h4>
                    <Wallet className="h-5 w-5 text-foreground-muted" />
                  </div>
                  <div className="flex justify-between text-sm text-foreground-secondary mb-2">
                    <span>Allocated: {formatCurrency(budget.allocated_amount)}</span>
                    <span>Spent: {formatCurrency(spent)}</span>
                  </div>
                  <Progress value={percentage > 100 ? 100 : percentage} className={cn("h-2", progressColor)} indicatorColor={progressColor} />
                  <div className="flex justify-between text-xs text-foreground-muted mt-2">
                    <span>{percentage.toFixed(0)}% Used</span>
                    <span className={remaining < 0 ? 'text-red-400' : ''}>Remaining: {formatCurrency(remaining)}</span>
                  </div>
                  <div className="mt-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(budget)}>Edit Budget</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
      <BudgetForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} budget={editingBudget} />
    </Card>
  );
}
