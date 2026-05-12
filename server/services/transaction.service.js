
import { supabase } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';

// Get all transactions for the authenticated user, with optional filters for date range, category, and type. Returns transactions with category name and type included.
export async function findAll(userId, filters = {}) {
  let query = supabase
    .from('transactions')
    .select(`*, categories(name, type)`)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (filters.from)        query = query.gte('date', filters.from);
  if (filters.to)          query = query.lte('date', filters.to);
  if (filters.category_id) query = query.eq('category_id', filters.category_id);
  if (filters.type)        query = query.eq('type', filters.type);

  const { data, error } = await query;
  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Get a single transaction by ID, ensuring it belongs to the authenticated user.
export async function findById(userId, id) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`*, categories(name, type)`)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new ApiError('Transaction not found.', 404);
  return data;
}

// Create a new transaction for the authenticated user. Requires title, amount, type (income or expense), category_id, and date in the request body. Note is optional.
export async function create(userId, payload) {
  const { title, amount, type, category_id, date, note } = payload;

  const { data, error } = await supabase
    .from('transactions')
    .insert({ user_id: userId, title, amount, type, category_id, date, note })
    .select()
    .single();

  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Update an existing transaction by ID, ensuring it belongs to the authenticated user. Allows updating title, amount, type, category_id, date, and note.
export async function update(userId, id, payload) {
  const { title, amount, type, category_id, date, note } = payload;

  const { data, error } = await supabase
    .from('transactions')
    .update({ title, amount, type, category_id, date, note })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Delete a transaction by ID, ensuring it belongs to the authenticated user.
export async function remove(userId, id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new ApiError(error.message, 500);
}