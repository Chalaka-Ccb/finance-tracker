import { ApiError } from '../middleware/errorHandler.js';
 
// Validate budget input for create and update routes. Ensures category_id is present
export function validateBudget(req, _res, next) {
  const { category_id, amount } = req.body;
  const errors = [];
 
  if (!category_id) errors.push('category_id is required.');
  if (!amount || isNaN(amount) || Number(amount) <= 0) errors.push('amount must be a positive number.');
 
  if (errors.length > 0) return next(new ApiError(errors.join(' '), 400));
  next();
}