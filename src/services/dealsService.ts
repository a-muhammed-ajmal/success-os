import { supabase } from '../lib/supabaseClient';
import type { Deal, DealStage } from '../types/database';

// Get current user ID helper
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Get all deals for the current user
export const getDeals = async (): Promise<Deal[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get deals by stage for Kanban view
export const getDealsByStage = async (stage: DealStage): Promise<Deal[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', userId)
    .eq('stage', stage)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get single deal by ID
export const getDealById = async (id: number): Promise<Deal | null> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create new deal
export const createDeal = async (deal: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Deal> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('deals')
    .insert({
      ...deal,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update deal
export const updateDeal = async (id: number, updates: Partial<Deal>): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update deal stage with auto-complete date logic
export const updateDealStage = async (id: number, newStage: DealStage): Promise<Deal> => {
  const updates: Partial<Deal> = { stage: newStage };

  // Auto-populate completed_date when moving to Completed or Unsuccessful
  if (newStage === 'Completed' || newStage === 'Unsuccessful') {
    updates.completed_date = new Date().toISOString();
  }

  return updateDeal(id, updates);
};

// Delete deal
export const deleteDeal = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Duplicate deal
export const duplicateDeal = async (id: number): Promise<Deal> => {
  const original = await getDealById(id);
  if (!original) throw new Error('Deal not found');

  const { id: _, user_id, created_at, updated_at, ...dealData } = original;
  return createDeal({
    ...dealData,
    stage: 'Application Processing', // Reset to first stage
    completed_date: null, // Reset completed date
  });
};

// Convert deal to connection
export const convertDealToConnection = async (dealId: number) => {
  const deal = await getDealById(dealId);
  if (!deal) throw new Error('Deal not found');

  const userId = await getCurrentUserId();

  // Get associated lead data if exists
  let leadData = null;
  if (deal.lead_id) {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('id', deal.lead_id)
      .single();
    leadData = data;
  }

  // Create connection with deal and lead data
  const { data: connection, error } = await supabase
    .from('connections')
    .insert({
      user_id: userId,
      // Map data from deal
      full_name: leadData?.full_name || '',
      dob: deal.dob,
      nationality: deal.nationality,
      passport_number: deal.passport_number,
      emirates_id: deal.emirates_id,
      mobile_number: leadData?.mobile_number,
      whatsapp_number: leadData?.whatsapp_number,
      email: leadData?.email,
      location: leadData?.location,
      company_name: leadData?.company_name,
      company_website: deal.company_website,
      company_landline: deal.company_landline,
      work_email: deal.professional_email,
      designation: leadData?.designation,
      monthly_salary: leadData?.salary_amount,
      salary_bank: deal.salary_bank,
      aecb_score: deal.aecb_score,
      iban_number: deal.iban_number,
    })
    .select()
    .single();

  if (error) throw error;

  return connection;
};
