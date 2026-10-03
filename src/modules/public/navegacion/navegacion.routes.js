import { Router } from 'express';
import { getNavegacion } from './navegacion.controller.js';

const router = Router();

router.get('/', getNavegacion);

export default router;