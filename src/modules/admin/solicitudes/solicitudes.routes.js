import { Router } from 'express';
import solicitudesController from './solicitudes.controller.js';
import { authMiddleware } from '../../../shared/auth.middleware.js';

const router = Router();

// Todo el módulo admin requiere autenticación
router.use(authMiddleware);

router.get('/', solicitudesController.getAll);
router.get('/estadisticas', solicitudesController.getEstadisticas);
router.get('/:id', solicitudesController.getById);
router.put('/:id/estado', solicitudesController.updateEstado);
router.put('/:id/notas', solicitudesController.updateNotas);
router.post('/:id/mensajes', solicitudesController.registrarMensaje);

export default router;
