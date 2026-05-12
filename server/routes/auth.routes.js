
import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { validateAuth } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validateAuth, register);
router.post('/login',    validateAuth, login);
router.post('/logout',   logout);

export default router;