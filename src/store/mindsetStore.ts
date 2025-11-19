import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { Affirmation, Motivation } from '../types';

interface MindsetState {
  // State
  affirmations: Affirmation[];
  motivations: Motivation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAffirmations: () => Promise<void>;
  fetchMotivations: () => Promise<void>;
  addAffirmation: (affirmation: Omit<Affirmation, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAffirmation: (id: string, updates: Partial<Affirmation>) => Promise<void>;
  deleteAffirmation: (id: string) => Promise<void>;
  addMotivation: (motivation: Omit<Motivation, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMotivation: (id: string, updates: Partial<Motivation>) => Promise<void>;
  deleteMotivation: (id: string) => Promise<void>;
  getRandomAffirmation: () => Affirmation | null;
  getRandomMotivation: () => Motivation | null;
}

export const useMindsetStore = create<MindsetState>((set, get) => ({
  // Initial state
  affirmations: [],
  motivations: [],
  isLoading: false,
  error: null,

  // Actions
  fetchAffirmations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('affirmations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ affirmations: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMotivations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('motivations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ motivations: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addAffirmation: async (affirmation) => {
    set({ isLoading: true, error: null });
    try {
      const newAffirmation = {
        ...affirmation,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('affirmations')
        .insert([newAffirmation])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ affirmations: [data, ...state.affirmations] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAffirmation: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('affirmations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        affirmations: state.affirmations.map((a) => (a.id === id ? data : a)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAffirmation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('affirmations')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        affirmations: state.affirmations.filter((a) => a.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addMotivation: async (motivation) => {
    set({ isLoading: true, error: null });
    try {
      const newMotivation = {
        ...motivation,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('motivations')
        .insert([newMotivation])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ motivations: [data, ...state.motivations] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMotivation: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('motivations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        motivations: state.motivations.map((m) => (m.id === id ? data : m)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMotivation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('motivations')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        motivations: state.motivations.filter((m) => m.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getRandomAffirmation: () => {
    const { affirmations } = get();
    if (affirmations.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return affirmations[randomIndex];
  },

  getRandomMotivation: () => {
    const { motivations } = get();
    if (motivations.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * motivations.length);
    return motivations[randomIndex];
  },
}));
