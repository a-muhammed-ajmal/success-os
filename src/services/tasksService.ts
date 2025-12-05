import { supabase } from '../lib/supabaseClient';
import type { Task } from '../types/database';

// Get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get today's focus tasks
export const getFocusTasks = async (): Promise<Task[]> => {
  const userId = await getCurrentUserId();
  // const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('is_focus_task', true)
    .neq('status', 'Done')
    // Ideally verify focus_date is today, but for now we'll filter client-side if needed
    // or assume the reset logic handles it
    .order('priority', { ascending: true }); // P1 first

  if (error) throw error;
  return data || [];
};

// Create task
export const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  const userId = await getCurrentUserId();

  // If setting as focus task, ensure limit of 3
  if (task.is_focus_task) {
    const focusTasks = await getFocusTasks();
    if (focusTasks.length >= 3) {
      throw new Error('Maximum 3 focus tasks allowed for today');
    }
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      user_id: userId,
      focus_date: task.is_focus_task ? new Date().toISOString().split('T')[0] : null
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update task
export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  // If toggling focus task on, check limit
  if (updates.is_focus_task === true) {
    const focusTasks = await getFocusTasks();
    // Use > 2 because we might be updating one that's already in the list (though unlikely if specific id)
    // Actually safer to check if explicitly adding
    if (focusTasks.length >= 3) {
       // Check if this task is already one of them
       const isAlreadyFocus = focusTasks.some(t => t.id === id);
       if (!isAlreadyFocus) {
         throw new Error('Maximum 3 focus tasks allowed for today');
       }
    }
    updates.focus_date = new Date().toISOString().split('T')[0];
  } else if (updates.is_focus_task === false) {
    updates.focus_date = null;
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete task
export const deleteTask = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Reset focus tasks at midnight (client-side trigger)
export const resetDailyFocus = async (): Promise<void> => {
  const userId = await getCurrentUserId();
  const today = new Date().toISOString().split('T')[0];

  // Disable focus for any task that has focus_date != today and is not done
  // Note: Supabase doesn't support easy "not equal" for dates stored as strings efficiently without casting
  // easier to fetch all focus tasks and update the old ones

  const { data: focusTasks } = await supabase
    .from('tasks')
    .select('id, focus_date')
    .eq('user_id', userId)
    .eq('is_focus_task', true);

  if (focusTasks) {
    const updates = focusTasks
      .filter(t => t.focus_date !== today)
      .map(t => updateTask(t.id, { is_focus_task: false, focus_date: null }));

    await Promise.all(updates);
  }
};
