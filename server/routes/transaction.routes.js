// Routes for transaction CRUD operations. All routes are protected by the authenticate middleware which validates the JWT and attaches req.user = { id, email }.
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';
import { validateTransaction } from '../validators/transaction.validator.js';

const router = Router();

router.use(authenticate); // all transaction routes require auth


router.get('/',     getTransactions);
router.get('/:id',  getTransactionById);
router.post('/',    validateTransaction, createTransaction);
router.put('/:id',  validateTransaction, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;