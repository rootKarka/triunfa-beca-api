import { Router } from 'express';
import { param, query, validationResult } from 'express-validator';
import { getImagenes, getImagenById } from './images.controller.js';

const router = Router();

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

// GET /api/v1/public/imagenes?seccion=Portada
router.get(
  '/',
  query('seccion').optional().isString().trim().withMessage('La sección debe ser un texto'),
  validate,
  getImagenes
);

// GET /api/v1/public/imagenes/:id
router.get(
  '/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validate,
  getImagenById
);

export default router;