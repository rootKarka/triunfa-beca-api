const { Router } = require('express');
const controller = require('./solicitudes.controller');
const { verifyToken, requireRole } = require('../../../shared/middlewares/auth.middleware');

const router = Router();

// Todas las rutas admin requieren autenticación
router.use(verifyToken);
router.use(requireRole('admin', 'staff'));

// GET /api/v1/admin/solicitudes
router.get('/', controller.getSolicitudes);

// GET /api/v1/admin/solicitudes/:id
router.get('/:id', controller.getSolicitudById);

// PATCH /api/v1/admin/solicitudes/:id/estado
router.patch('/:id/estado', controller.actualizarEstado);

module.exports = router;