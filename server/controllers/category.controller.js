
import { supabase } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';

// Get, create, delete categories. All routes are protected by the authenticate middleware which validates the JWT and attaches req.user = { id, email }.
export async function getCategories(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', req.user.id)
      .order('name');

    if (error) throw new ApiError(error.message, 500);
    res.json(data);
  } catch (err) { next(err); }
}

// Create a new category for the authenticated user. Requires name and type (income or expense) in the request body.
export async function createCategory(req, res, next) {
  try {
    const { name, type } = req.body;
    if (!name || !['income', 'expense'].includes(type)) {
      throw new ApiError('name and type (income | expense) are required.', 400);
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: req.user.id, name, type })
      .select()
      .single();

    if (error) throw new ApiError(error.message, 500);
    res.status(201).json(data);
  } catch (err) { next(err); }
}

// Delete a category for the authenticated user. Requires the category ID in the request parameters.
export async function deleteCategory(req, res, next) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw new ApiError(error.message, 500);
    res.status(204).send();
  } catch (err) { next(err); }
}