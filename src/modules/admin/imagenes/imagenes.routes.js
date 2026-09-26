import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import { uploadMiddleware } from './imagenes.upload.js';

import {
  getImagenes,
  getImagenById,
  createImagen,
  updateImagen,
  deleteImagen,
} from './imagenes.controller.js';

import { verifyToken } from '../../../shared/middelwares/auth.middelware.js';

const router = Router();

router.use(verifyToken);

const SECCIONES_VALIDAS = [
  'Portada',
  'Nosotros',
  'Niveles',
  'Talleres',
  'Ingresantes',
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

router.get('/', getImagenes);

router.get(
  '/:id',
  param('id')
    .isUUID()
    .withMessage('El ID debe ser un UUID válido'),
  validate,
  getImagenById
);

router.post(
  '/',
  uploadMiddleware,

  body('seccion')
    .notEmpty()
    .withMessage('La sección es obligatoria')
    .trim()
    .isIn(SECCIONES_VALIDAS)
    .withMessage('La sección seleccionada no es válida'),

  body('grupo')
    .notEmpty()
    .withMessage('El grupo es obligatorio')
    .trim(),

  body('texto_alt')
    .optional()
    .trim(),

  body('orden')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El orden debe ser un número entero no negativo'),

  body('es_activa')
    .optional()
    .isBoolean()
    .withMessage('es_activa debe ser un valor booleano'),

  validate,
  createImagen
);

router.patch(
  '/:id',

  param('id')
    .isUUID()
    .withMessage('El ID debe ser un UUID válido'),

  body('texto_alt')
    .optional()
    .trim(),

  body('seccion')
    .optional()
    .trim()
    .isIn(SECCIONES_VALIDAS)
    .withMessage('La sección seleccionada no es válida'),

  body('grupo')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El grupo no puede estar vacío'),

  body('orden')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El orden debe ser un número entero no negativo'),

  body('es_activa')
    .optional()
    .isBoolean()
    .withMessage('es_activa debe ser un valor booleano'),

  validate,
  updateImagen
);

router.delete(
  '/:id',
  param('id')
    .isUUID()
    .withMessage('El ID debe ser un UUID válido'),
  validate,
  deleteImagen
);

export default router;