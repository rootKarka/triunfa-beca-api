import { Router } from 'express';
import { getIngresantes } from './ingresantes.controller.js';

const router = Router();

router.get('/', getIngresantes);

export default router;