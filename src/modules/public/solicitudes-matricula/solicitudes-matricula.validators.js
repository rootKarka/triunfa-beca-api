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

/** Validación del formulario público de pre-matrícula (3 pasos) */
export const validarSolicitudMatricula = ejecutarValidacion([
  // Paso 1 — estudiante
  body('est_nombres').trim().notEmpty().withMessage('Nombres del estudiante requeridos').isLength({ max: 100 }),
  body('est_apellido_paterno').trim().notEmpty().withMessage('Apellido paterno requerido').isLength({ max: 100 }),
  body('est_apellido_materno').trim().notEmpty().withMessage('Apellido materno requerido').isLength({ max: 100 }),
  body('est_dni').trim().notEmpty().withMessage('DNI del estudiante requerido').isLength({ min: 8, max: 12 }),
  body('est_fecha_nacimiento').trim().notEmpty().withMessage('Fecha de nacimiento requerida').isISO8601().withMessage('Fecha inválida'),
  body('est_celular').trim().notEmpty().withMessage('Celular del estudiante requerido').isLength({ min: 9, max: 15 }),
  body('est_correo').trim().notEmpty().withMessage('Correo del estudiante requerido').isEmail().normalizeEmail(),
  // Paso 2 — académico
  body('nivel_educativo').trim().notEmpty().withMessage('Nivel educativo requerido'),
  body('grado_modalidad').trim().notEmpty().withMessage('Grado / modalidad requerido'),
  body('servicio_contratar').trim().notEmpty().withMessage('Servicio a contratar requerido'),
  body('turno_preferido').trim().notEmpty().withMessage('Turno preferido requerido'),
  // Paso 3 — apoderado
  body('apod_nombre_completo').trim().notEmpty().withMessage('Nombre del apoderado requerido').isLength({ max: 150 }),
  body('apod_dni').trim().notEmpty().withMessage('DNI del apoderado requerido').isLength({ min: 8, max: 12 }),
  body('apod_celular').trim().notEmpty().withMessage('Celular del apoderado requerido').isLength({ min: 9, max: 15 }),
  body('apod_correo').optional({ nullable: true }).trim().isEmail().withMessage('Correo del apoderado inválido').normalizeEmail(),
]);
