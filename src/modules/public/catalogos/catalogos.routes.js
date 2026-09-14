import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { getOpcionesCatalogo } from './catalogos.controller.js';

const router = Router();

router.get('/:codigo',
  param('codigo').isIn(['NIVEL_EDUCATIVO','SERVICIO','GRADO_MODALIDAD','TURNO']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'fail', errors: errors.array() });
    next();
  },
  getOpcionesCatalogo
);

export default router;