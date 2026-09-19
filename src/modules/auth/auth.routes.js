import { Router } from 'express';
import authController from './auth.controller.js';
import { authMiddleware } from '../../shared/auth.middleware.js';

const router = Router();

// Público
router.post('/login', authController.login);

// Protegido
router.get('/me', authMiddleware, authController.me);

export default router;
