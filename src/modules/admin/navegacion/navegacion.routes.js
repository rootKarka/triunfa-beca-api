import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import { getNavegacion, getNavegacionById, createNavegacion, updateNavegacion, deleteNavegacion } from './navegacion.controller.js';
import { verifyToken } from '../../../shared/middelwares/auth.middelware.js';

const router = Router();
router.use(verifyToken);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({
    success: false, message: 'Errores de validación',
    details: errors.array().map(err => ({ field: err.path, message: err.msg })),
  });
  next();
};

router.get('/', getNavegacion);

router.get('/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate, getNavegacionById
);

router.post('/',
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').trim().escape(),
  body('enlace').optional().trim(),
  body('padre_id').optional({ nullable: true }).isUUID().withMessage('padre_id debe ser un UUID válido'),
  body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser un entero no negativo'),
  body('es_activo').optional().isBoolean().withMessage('es_activo debe ser booleano'),
  validate, createNavegacion
);

router.patch('/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío').trim().escape(),
  body('enlace').optional().trim(),
  body('padre_id').optional({ nullable: true }).isUUID().withMessage('padre_id debe ser un UUID válido'),
  body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser un entero no negativo'),
  body('es_activo').optional().isBoolean().withMessage('es_activo debe ser booleano'),
  validate, updateNavegacion
);

router.delete('/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate, deleteNavegacion
);

export default router;