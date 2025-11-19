// src/components/command-center/QuickAddTransaction.tsx
'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; // CORRECTED
import { SectionHeader } from '@/components/shared/SectionHeader'; // CORRECTED
import { Button } from '@/components/ui/button'; // CORRECTED
import { Input } from '@/components/ui/input'; // CORRECTED
import { Label } from '@/components/ui/label'; // CORRECTED
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // CORRECTED
import { commandCenterService } from '@/services/commandCenterService'; // CORRECTED
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface QuickAddTransactionProps {
  onSuccess?: () => void;
}

export function QuickAddTransaction({ onSuccess }: QuickAddTransactionProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  const handleSubmit = async () => {
    if (!amount || !category) {
      setError('Amount and Category are required.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const transactionData = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString().split('T')[0], // Current date
      };
      await commandCenterService.addTransaction(transactionData);
      setAmount('');
      setCategory('');
      setDescription('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-secondary p-6 rounded-lg shadow-sm h-full flex flex-col">
      <SectionHeader title="Quick Add Transaction" description="Log income or expenses instantly." className="mb-4" />

      <div className="grid gap-4 flex-grow">
        <div className="flex gap-2">
          <Button
            variant={type === 'income' ? 'default' : 'secondary'}
            onClick={() => setType('income')}
            className="flex-1"
          >
            Income
          </Button>
          <Button
            variant={type === 'expense' ? 'default' : 'secondary'}
            onClick={() => setType('expense')}
            className="flex-1"
          >
            Expense
          </Button>
        </div>

        <div>
          <Label htmlFor="amount" className="sr-only">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="sr-only">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description" className="sr-only">Description</Label>
          <Input
            id="description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

      <Button onClick={handleSubmit} className="w-full mt-4" disabled={isLoading}>
        {isLoading ? <LoadingSpinner className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
        Add {type === 'income' ? 'Income' : 'Expense'}
      </Button>
    </div>
  );
}
