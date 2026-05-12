import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

const router = Router();

router.use(authenticate);

router.get('/',       getCategories);
router.post('/',      createCategory);
router.delete('/:id', deleteCategory);

export default router;