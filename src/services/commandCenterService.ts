import { supabase } from 'lib/supabase/client';
import type { Affirmation, Motivation, Task, Transaction } from 'src/types';

export const commandCenterService = {
  // ============================================
  // TASKS - Priority Block
  // ============================================

  // Get urgent tasks (high/urgent priority, due within 7 days)
  async getUrgentTasks(limit: number = 10): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await supabase
      .from('tasks')
      .select('*, project:projects(*)')
      .in('status', ['todo', 'in-progress'])
      .in('priority', ['high', 'urgent'])
      .gte('due_date', today)
      .lte('due_date', nextWeek)
      .order('due_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Complete a task
  async completeTask(taskId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select('*, project:projects(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // TRANSACTIONS - Quick Add
  // ============================================

  // Add quick transaction
  async addTransaction(transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
  }): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        ...transaction,
        date: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get today's transactions
  async getTodayTransactions(): Promise<Transaction[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('date', today)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ============================================
  // AFFIRMATIONS - Daily Discipline Bank
  // ============================================

  // Get active affirmations
  async getActiveAffirmations(): Promise<Affirmation[]> {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add affirmation
  async addAffirmation(text: string, category?: string): Promise<Affirmation> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    // Get max order_index
    const { data: maxData } = await supabase
      .from('affirmations')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxData?.order_index || 0) + 1;

    const { data, error } = await supabase
      .from('affirmations')
      .insert([{
        user_id: user.id,
        text,
        category: category || 'discipline',
        order_index: nextOrder,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // MOTIVATIONS - Daily Quotes
  // ============================================

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
