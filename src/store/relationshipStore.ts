import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { FuturePlan, ImportantDate, RelationshipExpense } from '../types';

interface RelationshipState {
  // State
  importantDates: ImportantDate[];
  futurePlans: FuturePlan[];
  relationshipExpenses: RelationshipExpense[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchImportantDates: () => Promise<void>;
  fetchFuturePlans: () => Promise<void>;
  fetchRelationshipExpenses: () => Promise<void>;
  addImportantDate: (date: Omit<ImportantDate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateImportantDate: (id: string, updates: Partial<ImportantDate>) => Promise<void>;
  deleteImportantDate: (id: string) => Promise<void>;
  addFuturePlan: (plan: Omit<FuturePlan, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFuturePlan: (id: string, updates: Partial<FuturePlan>) => Promise<void>;
  deleteFuturePlan: (id: string) => Promise<void>;
  addRelationshipExpense: (expense: Omit<RelationshipExpense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRelationshipExpense: (id: string, updates: Partial<RelationshipExpense>) => Promise<void>;
  deleteRelationshipExpense: (id: string) => Promise<void>;
  getUpcomingDates: (days: number) => ImportantDate[];
  getUpcomingPlans: () => FuturePlan[];
}

export const useRelationshipStore = create<RelationshipState>((set, get) => ({
  // Initial state
  importantDates: [],
  futurePlans: [],
  relationshipExpenses: [],
  isLoading: false,
  error: null,

  // Actions
  fetchImportantDates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('important_dates')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) throw error;

      set({ importantDates: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFuturePlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('future_plans')
        .select('*')
        .eq('is_active', true)
        .order('target_date', { ascending: true });

      if (error) throw error;

      set({ futurePlans: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRelationshipExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('relationship_expenses')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      if (error) throw error;

      set({ relationshipExpenses: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addImportantDate: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const newDate = {
        ...date,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('important_dates')
        .insert([newDate])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ importantDates: [...state.importantDates, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateImportantDate: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('important_dates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        importantDates: state.importantDates.map((d) => (d.id === id ? data : d)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteImportantDate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('important_dates')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        importantDates: state.importantDates.filter((d) => d.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addFuturePlan: async (plan) => {
    set({ isLoading: true, error: null });
    try {
      const newPlan = {
        ...plan,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('future_plans')
        .insert([newPlan])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ futurePlans: [...state.futurePlans, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFuturePlan: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('future_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        futurePlans: state.futurePlans.map((p) => (p.id === id ? data : p)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFuturePlan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('future_plans')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        futurePlans: state.futurePlans.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addRelationshipExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      const newExpense = {
        ...expense,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('relationship_expenses')
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ relationshipExpenses: [...state.relationshipExpenses, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateRelationshipExpense: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('relationship_expenses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        relationshipExpenses: state.relationshipExpenses.map((e) => (e.id === id ? data : e)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRelationshipExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('relationship_expenses')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        relationshipExpenses: state.relationshipExpenses.filter((e) => e.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getUpcomingDates: (days) => {
    const { importantDates } = get();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return importantDates.filter((date) => {
      const dateObj = new Date(date.date);
      return dateObj >= today && dateObj <= futureDate;
    });
  },

  getUpcomingPlans: () => {
    const { futurePlans } = get();
    const today = new Date();

    return futurePlans.filter((plan) => {
      const targetDate = new Date(plan.target_date);
      return targetDate >= today;
    });
  },
}));
