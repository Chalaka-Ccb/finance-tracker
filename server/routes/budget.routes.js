// Routes for budget CRUD operations and dashboard progress. All routes are protected by the authenticate middleware which validates the JWT and attaches req.user = { id, email }.
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getBudgets,
  getBudgetProgress,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';
import { validateBudget } from '../validators/budget.validator.js';

const router = Router();

router.use(authenticate);

router.get('/',           getBudgets);
router.get('/progress',   getBudgetProgress);   // dashboard widget
router.post('/',          validateBudget, createBudget);
router.put('/:id',        validateBudget, updateBudget);
router.delete('/:id',     deleteBudget);

export default router;