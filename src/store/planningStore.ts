import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { MonthlyPlan, VisionItem, WeeklyReview } from '../types';

interface PlanningState {
  // State
  visionItems: VisionItem[];
  weeklyReviews: WeeklyReview[];
  monthlyPlans: MonthlyPlan[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVisionItems: () => Promise<void>;
  fetchWeeklyReviews: () => Promise<void>;
  fetchMonthlyPlans: () => Promise<void>;
  addVisionItem: (item: Omit<VisionItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateVisionItem: (id: string, updates: Partial<VisionItem>) => Promise<void>;
  deleteVisionItem: (id: string) => Promise<void>;
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateWeeklyReview: (id: string, updates: Partial<WeeklyReview>) => Promise<void>;
  deleteWeeklyReview: (id: string) => Promise<void>;
  addMonthlyPlan: (plan: Omit<MonthlyPlan, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMonthlyPlan: (id: string, updates: Partial<MonthlyPlan>) => Promise<void>;
  deleteMonthlyPlan: (id: string) => Promise<void>;
  getCurrentWeekReview: () => WeeklyReview | null;
  getCurrentMonthPlan: () => MonthlyPlan | null;
}

export const usePlanningStore = create<PlanningState>((set, get) => ({
  // Initial state
  visionItems: [],
  weeklyReviews: [],
  monthlyPlans: [],
  isLoading: false,
  error: null,

  // Actions
  fetchVisionItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vision_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ visionItems: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWeeklyReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .order('week_start', { ascending: false });

      if (error) throw error;

      set({ weeklyReviews: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMonthlyPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('monthly_plans')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;

      set({ monthlyPlans: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addVisionItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = {
        ...item,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('vision_items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ visionItems: [data, ...state.visionItems] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateVisionItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vision_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        visionItems: state.visionItems.map((i) => (i.id === id ? data : i)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVisionItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('vision_items')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        visionItems: state.visionItems.filter((i) => i.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addWeeklyReview: async (review) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ weeklyReviews: [data, ...state.weeklyReviews] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateWeeklyReview: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        weeklyReviews: state.weeklyReviews.map((r) => (r.id === id ? data : r)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteWeeklyReview: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('weekly_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        weeklyReviews: state.weeklyReviews.filter((r) => r.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addMonthlyPlan: async (plan) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('monthly_plans')
        .insert([plan])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ monthlyPlans: [data, ...state.monthlyPlans] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMonthlyPlan: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('monthly_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        monthlyPlans: state.monthlyPlans.map((p) => (p.id === id ? data : p)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMonthlyPlan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('monthly_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        monthlyPlans: state.monthlyPlans.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrentWeekReview: () => {
    const { weeklyReviews } = get();
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return weeklyReviews.find((review) => {
      const reviewDate = new Date(review.week_start);
      return reviewDate.toDateString() === startOfWeek.toDateString();
    }) || null;
  },

  getCurrentMonthPlan: () => {
    const { monthlyPlans } = get();
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    return monthlyPlans.find((plan) =>
      plan.month === currentMonth && plan.year === currentYear
    ) || null;
  },
}));
