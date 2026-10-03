import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { verifyToken } from '../../../shared/middelwares/auth.middelware.js';
import { uploadMiddleware } from './ingresantes.upload.js';
import {
  getIngresantes,
  getIngresanteById,
  createIngresante,
  updateIngresante,
  deleteIngresante,
} from './ingresantes.controller.js';

const router = Router();

router.use(verifyToken);

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

router.get('/', getIngresantes);

router.get(
  '/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate,
  getIngresanteById,
);

router.post(
  '/',
  uploadMiddleware,
  body('carrera')
    .trim()
    .notEmpty().withMessage('La carrera es obligatoria')
    .isLength({ max: 150 }).withMessage('La carrera no puede superar 150 caracteres'),
  body('universidad')
    .trim()
    .notEmpty().withMessage('La universidad es obligatoria')
    .isLength({ max: 150 }).withMessage('La universidad no puede superar 150 caracteres'),
  body('modalidad')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('La modalidad no puede superar 150 caracteres'),
  body('texto_alt')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('El texto alternativo no puede superar 255 caracteres'),
  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('El orden debe ser un número entero no negativo'),
  body('es_activo')
    .optional()
    .isBoolean().withMessage('es_activo debe ser un valor booleano'),
  validate,
  createIngresante,
);

router.patch(
  '/:id',
  uploadMiddleware,
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('carrera')
    .optional()
    .trim()
    .notEmpty().withMessage('La carrera no puede estar vacía')
    .isLength({ max: 150 }).withMessage('La carrera no puede superar 150 caracteres'),
  body('universidad')
    .optional()
    .trim()
    .notEmpty().withMessage('La universidad no puede estar vacía')
    .isLength({ max: 150 }).withMessage('La universidad no puede superar 150 caracteres'),
  body('modalidad')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('La modalidad no puede superar 150 caracteres'),
  body('texto_alt')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('El texto alternativo no puede superar 255 caracteres'),
  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('El orden debe ser un número entero no negativo'),
  body('es_activo')
    .optional()
    .isBoolean().withMessage('es_activo debe ser un valor booleano'),
  validate,
  updateIngresante,
);

router.delete(
  '/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate,
  deleteIngresante,
);

export default router;