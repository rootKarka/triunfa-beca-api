import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { verifyToken, requireRole } from '../../../shared/middelwares/auth.middelware.js';
import { listarAuditoriaReciente } from './auditoria.controller.js';

const router = Router();

const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success:false, errors:errors.array() });
  next();
};

router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.get('/reciente',
  query('limite').optional().isInt({ min:1, max:50 }).withMessage('El límite debe estar entre 1 y 50'),
  validar,
  listarAuditoriaReciente
);

export default router;