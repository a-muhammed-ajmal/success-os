import { supabase } from '@/lib/supabase/client';
import type { FuturePlan, ImportantDate, RelationshipExpense } from '@/types';
import { format } from 'date-fns';

export const relationshipService = {
  // ====================================================================
  // IMPORTANT DATES
  // ====================================================================
  async getImportantDates(): Promise<ImportantDate[]> {
    const { data, error } = await supabase
      .from('important_dates')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createImportantDate(date: Partial<ImportantDate>): Promise<ImportantDate> {
    const { data, error } = await supabase
      .from('important_dates')
      .insert([date])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateImportantDate(id: string, updates: Partial<ImportantDate>): Promise<ImportantDate> {
    const { data, error } = await supabase
      .from('important_dates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteImportantDate(id: string): Promise<void> {
    const { error } = await supabase
      .from('important_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ====================================================================
  // FUTURE PLANS
  // ====================================================================
  async getFuturePlans(): Promise<FuturePlan[]> {
    const { data, error } = await supabase
      .from('future_plans')
      .select('*')
      .order('target_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createFuturePlan(plan: Partial<FuturePlan>): Promise<FuturePlan> {
    const { data, error } = await supabase
      .from('future_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFuturePlan(id: string, updates: Partial<FuturePlan>): Promise<FuturePlan> {
    const { data, error } = await supabase
      .from('future_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFuturePlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('future_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ====================================================================
  // RELATIONSHIP EXPENSES
  // ====================================================================
  async getRelationshipExpenses(startDate?: Date, endDate?: Date): Promise<RelationshipExpense[]> {
    let query = supabase.from('relationship_expenses').select('*');

    if (startDate) {
      query = query.gte('date', format(startDate, 'yyyy-MM-dd'));
    }
    if (endDate) {
      query = query.lte('date', format(endDate, 'yyyy-MM-dd'));
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createRelationshipExpense(expense: Partial<RelationshipExpense>): Promise<RelationshipExpense> {
    const { data, error } = await supabase
      .from('relationship_expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRelationshipExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('relationship_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
