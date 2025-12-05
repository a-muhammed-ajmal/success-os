import { supabase } from '../lib/supabaseClient';
import type { Lead } from '../types/database';

// Get current user ID helper
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Get all leads for the current user
export const getLeads = async (): Promise<Lead[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get leads by status for pipeline view
export const getLeadsByStatus = async (status: string): Promise<Lead[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get single lead by ID
export const getLeadById = async (id: number): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create new lead
export const createLead = async (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...lead,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update lead
export const updateLead = async (id: number, updates: Partial<Lead>): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete lead
export const deleteLead = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Duplicate lead
export const duplicateLead = async (id: number): Promise<Lead> => {
  const original = await getLeadById(id);
  if (!original) throw new Error('Lead not found');

  const { id: _, user_id, created_at, updated_at, ...leadData } = original;
  return createLead(leadData);
};

// Convert lead to deal
export const convertLeadToDeal = async (leadId: number) => {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error('Lead not found');

  const userId = await getCurrentUserId();

  // Create deal with lead data
  const { data: deal, error } = await supabase
    .from('deals')
    .insert({
      lead_id: leadId,
      user_id: userId,
      stage: 'Application Processing',
      // Transfer relevant data from lead
      // Note: Deal table will need to reference lead data or we store it separately
    })
    .select()
    .single();

  if (error) throw error;

  // Optionally delete or archive the lead
  // await deleteLead(leadId);

  return deal;
};
