import { Router } from 'express';
import { getSecciones } from './secciones.controller.js';

const router = Router();

router.get('/', getSecciones);

export default router;