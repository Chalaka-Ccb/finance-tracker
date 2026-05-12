
import { ApiError } from '../middleware/errorHandler.js';

// Validate transaction input for create and update routes. Ensures title is a non-empty string, amount is a positive number, type is either "income" or "expense", category_id is present, and date is a valid ISO date string.
export function validateTransaction(req, _res, next) {
  const { title, amount, type, category_id, date } = req.body;
  const errors = [];
// Note: We allow partial updates in the update route, so we only validate fields that are present in the request body.
  if (!title || typeof title !== 'string') errors.push('title is required.'); 
  if (!amount || isNaN(amount) || Number(amount) <= 0) errors.push('amount must be a positive number.');
  if (!['income', 'expense'].includes(type)) errors.push('type must be "income" or "expense".');
  if (!category_id) errors.push('category_id is required.');
  if (!date || isNaN(Date.parse(date))) errors.push('date must be a valid ISO date string.');

  if (errors.length > 0)
    return next(new ApiError(errors.join(' '), 400));
  next();
}