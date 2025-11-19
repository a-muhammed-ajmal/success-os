import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { Budget, SavingGoal, Transaction } from '../types';

interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}

interface FinanceState {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  savingGoals: SavingGoal[];
  monthlyStats: MonthlyStats;
  selectedMonth: Date;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedMonth: (month: Date) => void;
  fetchTransactions: (month?: Date) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  calculateMonthlyStats: (month?: Date) => void;

  fetchBudgets: (month?: Date) => Promise<void>;
  setBudget: (category: string, allocatedAmount: number, month?: Date) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  fetchSavingGoals: () => Promise<void>;
  addSavingGoal: (goal: Omit<SavingGoal, 'id' | 'created_at' | 'is_completed'>) => Promise<void>;
  updateSavingGoal: (id: string, updates: Partial<SavingGoal>) => Promise<void>;
  deleteSavingGoal: (id: string) => Promise<void>;
}

const initialMonthlyStats: MonthlyStats = {
  totalIncome: 0,
  totalExpenses: 0,
  netIncome: 0,
  incomeByCategory: {},
  expenseByCategory: {},
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial state
  transactions: [],
  budgets: [],
  savingGoals: [],
  monthlyStats: initialMonthlyStats,
  selectedMonth: new Date(),
  isLoading: false,
  error: null,

  // Actions
  setSelectedMonth: (month) => set({ selectedMonth: month }),

  fetchTransactions: async (month) => {
    set({ isLoading: true, error: null });
    try {
      const selectedMonth = month || get().selectedMonth;
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      set({ transactions: data || [] });
      get().calculateMonthlyStats(selectedMonth);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ transactions: [data, ...state.transactions] }));
      get().calculateMonthlyStats();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? data : t)),
      }));
      get().calculateMonthlyStats();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      get().calculateMonthlyStats();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateMonthlyStats: (month) => {
    const selectedMonth = month || get().selectedMonth;
    const transactions = get().transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getFullYear() === selectedMonth.getFullYear() &&
        transactionDate.getMonth() === selectedMonth.getMonth()
      );
    });

    const stats = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
          acc.incomeByCategory[transaction.category] =
            (acc.incomeByCategory[transaction.category] || 0) + transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
          acc.expenseByCategory[transaction.category] =
            (acc.expenseByCategory[transaction.category] || 0) + transaction.amount;
        }
        return acc;
      },
      { ...initialMonthlyStats }
    );

    stats.netIncome = stats.totalIncome - stats.totalExpenses;
    set({ monthlyStats: stats });
  },

  fetchBudgets: async (month) => {
    set({ isLoading: true, error: null });
    try {
      const selectedMonth = month || get().selectedMonth;
      const monthStr = selectedMonth.toISOString().slice(0, 7); // YYYY-MM

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', monthStr)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ budgets: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  setBudget: async (category, allocatedAmount, month) => {
    set({ isLoading: true, error: null });
    try {
      const selectedMonth = month || get().selectedMonth;
      const monthStr = selectedMonth.toISOString().slice(0, 7);

      // Check if budget already exists for this category and month
      const existingBudget = get().budgets.find(
        (b) => b.category === category && b.month === monthStr
      );

      if (existingBudget) {
        // Update existing budget
        const { data, error } = await supabase
          .from('budgets')
          .update({ allocated_amount: allocatedAmount })
          .eq('id', existingBudget.id)
          .select()
          .single();

        if (error) throw error;

        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === existingBudget.id ? data : b)),
        }));
      } else {
        // Create new budget
        const { data, error } = await supabase
          .from('budgets')
          .insert([{ category, allocated_amount: allocatedAmount, month: monthStr }])
          .select()
          .single();

        if (error) throw error;

        set((state) => ({ budgets: [...state.budgets, data] }));
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateBudget: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === id ? data : b)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('budgets').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSavingGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('saving_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ savingGoals: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addSavingGoal: async (goal) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('saving_goals')
        .insert([{ ...goal, is_completed: false }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ savingGoals: [data, ...state.savingGoals] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSavingGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('saving_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        savingGoals: state.savingGoals.map((g) => (g.id === id ? data : g)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSavingGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('saving_goals').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        savingGoals: state.savingGoals.filter((g) => g.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
