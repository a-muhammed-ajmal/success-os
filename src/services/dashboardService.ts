import { supabase } from '../lib/supabaseClient';

export const getDashboardStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Deals Processing (Application Processing, Verification Needed, Activation Needed)
  const { count: processingCount, error: processingError } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('stage', ['Application Processing', 'Verification Needed', 'Activation Needed']);

  // Done Successfully (Completed)
  const { count: completedCount, error: completedError } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('stage', 'Completed');

  // Days Remaining: Default to days remaining in current month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = Math.max(0, Math.ceil((lastDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  if (processingError) console.error('Error fetching processing deals:', processingError);
  if (completedError) console.error('Error fetching completed deals:', completedError);

  return {
    dealsProcessing: processingCount || 0,
    doneSuccessfully: completedCount || 0,
    daysRemaining: daysRemaining
  };
};
