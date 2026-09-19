import { body, validationResult } from 'express-validator';
import { AppError } from '../../../shared/app-error.js';

const ejecutarValidacion = (validaciones) => async (req, res, next) => {
  await Promise.all(validaciones.map((v) => v.run(req)));
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const detalle = errores.array().map((e) => e.msg).join(' | ');
    return next(new AppError(400, detalle));
  }
  return next();
};

/** Validación del formulario público de información */
export const validarSolicitudInfo = ejecutarValidacion([
  body('nombres_apellidos').trim().notEmpty().withMessage('Nombres y apellidos requeridos').isLength({ max: 150 }),
  body('dni').trim().notEmpty().withMessage('DNI requerido').isLength({ min: 8, max: 12 }).withMessage('DNI inválido'),
  body('celular').trim().notEmpty().withMessage('Celular requerido').isLength({ min: 9, max: 15 }).withMessage('Celular inválido'),
  body('correo').trim().notEmpty().withMessage('Correo requerido').isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('nivel_educativo').trim().notEmpty().withMessage('Nivel educativo requerido'),
  body('servicio_interes').trim().notEmpty().withMessage('Servicio de interés requerido'),
  body('mensaje').optional({ nullable: true }).trim().isLength({ max: 1000 }),
  body('canal_preferido').optional({ nullable: true }).trim().isIn(['WhatsApp', 'Llamada', 'Correo']),
]);
