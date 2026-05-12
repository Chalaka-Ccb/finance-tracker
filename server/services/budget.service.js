import { supabase } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function findAll(userId) {
  const { data, error } = await supabase
    .from('budgets')
    .select(`*, categories(name, type)`)
    .eq('user_id', userId);

  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Get budget progress for the dashboard widget, which includes total spent vs budgeted for the current month.
export async function getProgress(userId) {
  const { data, error } = await supabase
    .from('budget_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Create a new budget for the authenticated user.
export async function create(userId, payload) {
  const { category_id, amount, period = 'monthly' } = payload;

  const { data, error } = await supabase
    .from('budgets')
    .insert({ user_id: userId, category_id, amount, period })
    .select()
    .single();

  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Update an existing budget by ID, ensuring it belongs to the authenticated user.
export async function update(userId, id, payload) {
  const { amount, period } = payload;

  const { data, error } = await supabase
    .from('budgets')
    .update({ amount, period })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new ApiError(error.message, 500);
  return data;
}

// Delete a budget by ID, ensuring it belongs to the authenticated user.
export async function remove(userId, id) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new ApiError(error.message, 500);
}