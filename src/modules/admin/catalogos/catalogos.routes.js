import { Router } from 'express';
import { param,body,validationResult } from 'express-validator';
import { verifyToken,requireRole } from '../../../shared/middelwares/auth.middelware.js';
import { listarOpciones,agregarOpcion,editarOpcion,actualizarEstado } from './catalogos.controller.js';

const router=Router();
const codigos=['NIVEL_EDUCATIVO','SERVICIO','GRADO_MODALIDAD','TURNO'];

const validar=(req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({success:false,errors:errors.array()});
  next();
};

router.use(verifyToken);
router.use(requireRole('admin','staff'));

router.get('/:codigo/opciones',
  param('codigo').isIn(codigos),
  validar,listarOpciones
);

router.post('/:codigo/opciones',
  param('codigo').isIn(codigos),
  body('nombre').trim().notEmpty(),
  body('orden').optional().isInt({min:0}),
  validar,agregarOpcion
);

router.patch('/opciones/:id',
  param('id').isUUID(),
  body('nombre').trim().notEmpty(),
  body('orden').isInt({min:0}),
  validar,editarOpcion
);

router.patch('/opciones/:id/estado',
  param('id').isUUID(),
  body('activo').isBoolean(),
  validar,actualizarEstado
);

export default router;