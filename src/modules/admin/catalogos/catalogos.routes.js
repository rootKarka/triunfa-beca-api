import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import { authMiddleware, requireRole } from '../../../shared/middelwares/auth.middelware.js';
import {
  listarOpciones,
  agregarOpcion,
  editarOpcion,
  actualizarEstado,
  eliminarOpcion,
} from './catalogos.controller.js';

const router = Router();

const codigos = [
  'INFO_NIVEL_EDUCATIVO',
  'INFO_SERVICIO_INTERES',
  'MATRICULA_NIVEL_EDUCATIVO',
  'MATRICULA_GRADO_MODALIDAD',
  'MATRICULA_SERVICIO',
  'MATRICULA_TURNO',
];

const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Protección de rutas y verificación de roles (soporta mayúsculas y minúsculas)
router.use(authMiddleware);
router.use(requireRole('admin', 'ADMIN', 'staff', 'STAFF'));

// Listar opciones de un catálogo
router.get(
  '/:codigo/opciones',
  param('codigo').isIn(codigos).withMessage('Código de catálogo no válido'),
  validar,
  listarOpciones
);

// Agregar opción a un catálogo
router.post(
  '/:codigo/opciones',
  param('codigo').isIn(codigos).withMessage('Código de catálogo no válido'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('orden').optional().isInt({ min: 0 }).withMessage('El orden debe ser válido'),
  validar,
  agregarOpcion
);

// Editar una opción
router.patch(
  '/opciones/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('orden').isInt({ min: 0 }).withMessage('El orden debe ser válido'),
  validar,
  editarOpcion
);

// Cambiar estado de una opción (activo / inactivo)
router.patch(
  '/opciones/:id/estado',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('activo').isBoolean().withMessage('activo debe ser booleano'),
  validar,
  actualizarEstado
);

// Eliminar opción
router.delete(
  '/opciones/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validar,
  eliminarOpcion
);

export default router;