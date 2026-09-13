import { Router } from 'express';
import { body,validationResult } from 'express-validator';
import { login } from './auth.controller.js';

const router=Router();

const validar=(req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({success:false,errors:errors.array()});
  next();
};

router.post('/login',
  body('correo').isEmail().withMessage('Correo electrónico inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  validar,login
);

export default router;