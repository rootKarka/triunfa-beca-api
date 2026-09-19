import { Router } from 'express';
import { getPlantillas } from './plantillas.controller.js';
import { authMiddleware } from '../../../shared/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getPlantillas);

export default router;