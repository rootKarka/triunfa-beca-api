import { Router } from 'express';
<<<<<<< HEAD
import { param,body,validationResult } from 'express-validator';
import { authMiddleware, requireRole } from '../../../shared/auth.middleware.js';
import { listarOpciones,agregarOpcion,editarOpcion,actualizarEstado } from './catalogos.controller.js';
=======
import { param, body, validationResult } from 'express-validator';
import { verifyToken, requireRole } from '../../../shared/middelwares/auth.middelware.js';
import { listarOpciones, agregarOpcion, editarOpcion, actualizarEstado, eliminarOpcion } from './catalogos.controller.js';
>>>>>>> feature/correcion-rama-leisy-03oct

const router = Router();

const codigos = [
  'INFO_NIVEL_EDUCATIVO',
  'INFO_SERVICIO_INTERES',
  'MATRICULA_NIVEL_EDUCATIVO',
  'MATRICULA_GRADO_MODALIDAD',
  'MATRICULA_SERVICIO',
  'MATRICULA_TURNO'
];

const validar = (req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ success:false, errors:errors.array() });
  next();
};

<<<<<<< HEAD
router.use(authMiddleware);
router.use(requireRole('admin','staff'));
=======
router.use(verifyToken);
router.use(requireRole('ADMIN'));
>>>>>>> feature/correcion-rama-leisy-03oct

router.get('/:codigo/opciones',
  param('codigo').isIn(codigos),
  validar, listarOpciones
);

router.post('/:codigo/opciones',
  param('codigo').isIn(codigos),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('orden').optional().isInt({ min:0 }).withMessage('El orden debe ser válido'),
  validar, agregarOpcion
);

router.patch('/opciones/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('orden').isInt({ min:0 }).withMessage('El orden debe ser válido'),
  validar, editarOpcion
);

router.patch('/opciones/:id/estado',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  body('activo').isBoolean().withMessage('activo debe ser booleano'),
  validar, actualizarEstado
);

router.delete('/opciones/:id',
  param('id').isUUID().withMessage('El ID debe ser un UUID válido'),
  validar, eliminarOpcion
);

export default router;