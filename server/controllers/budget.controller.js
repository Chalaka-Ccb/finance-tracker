// Get, create, update, delete budgets. All routes are protected by the authenticate middleware which validates the JWT and attaches req.user = { id, email }.
import * as budgetService from '../services/budget.service.js';

// Get all budgets for the authenticated user.
export async function getBudgets(req, res, next) {
  try {
    const data = await budgetService.findAll(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
}

// Get budget progress for the dashboard widget, which includes total spent vs budgeted for the current month.
export async function getBudgetProgress(req, res, next) {
  try {
    const data = await budgetService.getProgress(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
}

// Create a new budget for the authenticated user.
export async function createBudget(req, res, next) {
  try {
    const data = await budgetService.create(req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
}

// Update an existing budget by ID, ensuring it belongs to the authenticated user.
export async function updateBudget(req, res, next) {
  try {
    const data = await budgetService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
}

// Delete a budget by ID, ensuring it belongs to the authenticated user.
export async function deleteBudget(req, res, next) {
  try {
    await budgetService.remove(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}