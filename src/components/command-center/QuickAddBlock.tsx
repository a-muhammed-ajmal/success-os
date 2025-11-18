  // Get random motivation
  async getRandomMotivation(): Promise<Motivation | null> {
    const { data, error } = await supabase
      .from('motivations')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Return random motivation
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  },

  // Add motivation
  async addMotivation(quote: string, author?: string, category?: string): Promise<Motivation> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('motivations')
      .insert([{
        user_id: user.id,
        quote,
        author: author || null,
        category: category || 'discipline',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // DASHBOARD STATS
  // ============================================
  
  // Get command center statistics
  async getCommandCenterStats() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    // Get task counts
    const { data: taskCounts } = await supabase
      .from('tasks')
      .select('status', { count: 'exact' })
      .eq('user_id', user.id);

    // Get today's transactions
    const today = new Date().toISOString().split('T')[0];
    const { data: todayTransactions } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', user.id)
      .eq('date', today);

    // Calculate totals
    const totalIncome = todayTransactions
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const totalExpense = todayTransactions
      ?.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return {
      tasks: {
        todo: taskCounts?.filter(t => t.status === 'todo').length || 0,
        inProgress: taskCounts?.filter(t => t.status === 'in-progress').length || 0,
        completed: taskCounts?.filter(t => t.status === 'completed').length || 0,
      },
      finance: {
        todayIncome: totalIncome,
        todayExpense: totalExpense,
        netCashFlow: totalIncome - totalExpense,
      },
    };
  },
};


Part 4: React Components
Create components/command-center/PrioritiesBlock.tsx:
// components/command-center/PrioritiesBlock.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { commandCenterService } from '@/services/commandCenterService';
import type { Task } from '@/types';

export function PrioritiesBlock() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUrgentTasks();
  }, []);

  const loadUrgentTasks = async () => {
    try {
      setLoading(true);
      const data = await commandCenterService.getUrgentTasks(10);
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await commandCenterService.completeTask(taskId);
      await loadUrgentTasks(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
      high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      low: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
        <p className="text-gray-400 text-sm">No urgent tasks! You're all caught up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const daysRemaining = task.due_date ? getDaysRemaining(task.due_date) : null;
        const isOverdue = daysRemaining !== null && daysRemaining < 0;

        return (
          <div
            key={task.id}
            className="bg-gray-900 border border-gray-700/50 rounded-lg p-3 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Project Badge */}
                {task.project && (
                  <div className="mb-2">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${task.project.color}20`,
                        color: task.project.color,
                      }}
                    >
                      {task.project.name}
                    </span>
                  </div>
                )}

                {/* Task Title */}
                <h4 className="text-sm font-semibold text-white mb-1 truncate">
                  {task.title}
                </h4>

                {/* Task Description */}
                {task.description && (
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                    {task.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs">
                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {task.priority}
                  </span>

                  {/* Due Date */}
                  {task.due_date && (
                    <span
                      className={`flex items-center ${
                        isOverdue ? 'text-red-400' : 'text-gray-400'
                      }`}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {isOverdue
                        ? `${Math.abs(daysRemaining!)} days overdue`
                        : `${daysRemaining} days left`}
                    </span>
                  )}
                </div>
              </div>

              {/* Complete Button */}
              <button
                onClick={() => handleCompleteTask(task.id)}
                className="flex-shrink-0 p-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 transition-colors"
                aria-label="Complete task"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}

      {/* See All Button */}
      <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors">
        See All Tasks
      </button>
    </div>
  );
}


Part 5: Quick Add Transaction Component
Create components/command-center/QuickAddTransaction.tsx:
// components/command-center/QuickAddTransaction.tsx
'use client';

import { useState } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { commandCenterService } from '@/services/commandCenterService';

interface QuickAddTransactionProps {
  onSuccess?: () => void;
}

export function QuickAddTransaction({ onSuccess }: QuickAddTransactionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const incomeCategories = ['Salary', 'Business', 'Freelance', 'Investment', 'Other'];
  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      setError('Amount and category are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await commandCenterService.addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description: description || undefined,
      });

      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setIsOpen(false);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Quick Add Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setType('income');
            setIsOpen(true);
          }}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Income
        </button>
        <button
          onClick={() => {
            setType('expense');
            setIsOpen(true);
          }}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Expense
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-indigo-400" />
                Add {type === 'income' ? 'Income' : 'Expense'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Type Toggle */}
              <div className="flex rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  Expense
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 
'use client';

import { Button } from 'components/ui/button';
import { useState } from 'react';
import { commandCenterService } from 'services/commandCenterService';

export function QuickAddBlock() {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    setLoading(true);
    try {
      await commandCenterService.addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description: description || undefined,
      });

      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-secondary border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Add</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setType('income')}
          >
            Income
          </Button>
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setType('expense')}
          >
            Expense
          </Button>
        </div>

        {/* Amount */}
        <div>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            required
          />
        </div>

        {/* Category */}
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g., Food, Salary, Rent)"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            required
          />
        </div>

        {/* Description */}
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>

        {/* Submit button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Transaction'}
        </Button>
      </form>
    </div>
  );
}
