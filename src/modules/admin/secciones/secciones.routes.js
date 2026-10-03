import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import { getSecciones, getSeccionById, createSeccion, updateSeccion, deleteSeccion } from './secciones.controller.js';
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

router.get('/', getSecciones);

router.get('/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate, getSeccionById
);

router.post('/',
  body('etiqueta').notEmpty().withMessage('La etiqueta es obligatoria').trim().escape(),
  body('titulo').notEmpty().withMessage('El título es obligatorio').trim().escape(),
  body('descripcion').optional({ nullable: true }).trim().escape(),
  body('texto_boton').optional({ nullable: true }).trim().escape(),
  body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser un entero no negativo'),
  body('es_activa').optional().isBoolean().withMessage('es_activa debe ser booleano'),
  validate, createSeccion
);

router.patch('/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('etiqueta').optional().notEmpty().withMessage('La etiqueta no puede estar vacía').trim().escape(),
  body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío').trim().escape(),
  body('descripcion').optional({ nullable: true }).trim().escape(),
  body('texto_boton').optional({ nullable: true }).trim().escape(),
  body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser un entero no negativo'),
  body('es_activa').optional().isBoolean().withMessage('es_activa debe ser booleano'),
  validate, updateSeccion
);

router.delete('/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate, deleteSeccion
);

export default router;