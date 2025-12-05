import { supabase } from '../lib/supabaseClient';
import type { Connection } from '../types/database';

// Get current user ID helper
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Get all connections for the current user
export const getConnections = async (): Promise<Connection[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get single connection by ID
export const getConnectionById = async (id: number): Promise<Connection | null> => {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create new connection
export const createConnection = async (connection: Omit<Connection, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Connection> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('connections')
    .insert({
      ...connection,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update connection
export const updateConnection = async (id: number, updates: Partial<Connection>): Promise<Connection> => {
  const { data, error } = await supabase
    .from('connections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete connection
export const deleteConnection = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Duplicate connection
export const duplicateConnection = async (id: number): Promise<Connection> => {
  const original = await getConnectionById(id);
  if (!original) throw new Error('Connection not found');

  const { id: _, user_id, created_at, updated_at, ...connectionData } = original;
  return createConnection(connectionData);
};
