// src/services/commandCenterService.ts
import { supabase } from '@/lib/supabase/client';
import type { Affirmation, Motivation, Task, Transaction } from '@/types';

// Placeholder service for Command Center interactions
// You will expand these methods with actual Supabase queries.
export const commandCenterService = {
  // ====================================================================
  // TASKS (for PrioritiesBlock)
  // ====================================================================
  async getUrgentTasks(): Promise<Task[]> {
    // Placeholder: Return mock data or fetch from Supabase
    // Example: Fetch from Supabase
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .in('priority', ['urgent', 'high'])
      .eq('status', 'todo')
      .order('due_date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching urgent tasks:', error);
      return [];
    }

    return data || [];
  },

  async completeTask(taskId: string): Promise<void> {
    // Placeholder: Update task status in Supabase
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // ====================================================================
  // MOTIVATION (for DailyMotivation)
  // ====================================================================
  async getRandomMotivation(): Promise<Motivation | null> {
    // Placeholder: Return mock data or fetch from Supabase
    const { data, error } = await supabase
      .from('motivations')
      .select('*')
      .order('created_at', { ascending: false }) // Or order by random
      .limit(1);

    if (error) {
      console.error('Error fetching random motivation:', error);
      return null;
    }

    return data?.[0] || null;
  },

  // ====================================================================
  // AFFIRMATIONS (for DailyDisciplineBank)
  // ====================================================================
  async getAffirmations(): Promise<Affirmation[]> {
    // Placeholder: Return mock data or fetch from Supabase
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching affirmations:', error);
      return [];
    }

    return data || [];
  },

  async addAffirmation(affirmation: Partial<Affirmation>): Promise<Affirmation> {
    // Placeholder: Add to Supabase
    const { data, error } = await supabase
      .from('affirmations')
      .insert([affirmation])
      .select()
      .single();

    if (error) {
      console.error('Error adding affirmation:', error);
      throw error;
    }
    return data;
  },

  // ====================================================================
  // TRANSACTIONS (for QuickAddTransaction)
  // ====================================================================
  async addTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    // Placeholder: Add to Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    return data;
  },
};
