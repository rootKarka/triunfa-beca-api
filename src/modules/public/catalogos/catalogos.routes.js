import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { getOpcionesCatalogo } from './catalogos.controller.js';

const router = Router();

const codigos = [
  'INFO_NIVEL_EDUCATIVO',
  'INFO_SERVICIO_INTERES',
  'MATRICULA_NIVEL_EDUCATIVO',
  'MATRICULA_GRADO_MODALIDAD',
  'MATRICULA_SERVICIO',
  'MATRICULA_TURNO'
];

router.get('/:codigo',
  param('codigo').isIn(codigos),
  (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ status:'fail', errors:errors.array() });
    next();
  },
  getOpcionesCatalogo
);

export default router;