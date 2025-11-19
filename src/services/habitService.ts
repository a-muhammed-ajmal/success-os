import { supabase } from '@/lib/supabase/client';
import type { Habit, HabitCompletion } from '@/types';
import { format } from 'date-fns';

export const habitService = {
  // ====================================================================
  // HABITS
  // ====================================================================
  async getHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createHabit(habit: Partial<Habit>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .insert([habit])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteHabit(id: string): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorderHabits(habitIds: string[]): Promise<void> {
    const updates = habitIds.map((id, index) => ({
      id,
      order_index: index,
    }));
    const { error } = await supabase.from('habits').upsert(updates);

    if (error) throw error;
  },

  // ====================================================================
  // HABIT COMPLETIONS
  // ====================================================================
  async getCompletions(startDate: Date, endDate: Date): Promise<HabitCompletion[]> {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .gte('date', start)
      .lte('date', end);

    if (error) throw error;
    return data || [];
  },

  async createCompletion(habitId: string, date: Date): Promise<HabitCompletion> {
    const dateString = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('habit_completions')
      .upsert(
        { habit_id: habitId, date: dateString, completed: true },
        { onConflict: 'habit_id,date' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCompletion(habitId: string, date: Date): Promise<void> {
    const dateString = format(date, 'yyyy-MM-dd');
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('date', dateString);

    if (error) throw error;
  },

  async updateCompletionNote(habitId: string, date: Date, note: string): Promise<HabitCompletion> {
    const dateString = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('habit_completions')
      .update({ notes: note })
      .eq('habit_id', habitId)
      .eq('date', dateString)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
