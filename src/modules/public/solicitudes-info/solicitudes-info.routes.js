import { Router } from 'express';
import { postSolicitudInfo } from './solicitudes-info.controller.js';
import { validarSolicitudInfo } from './solicitudes-info.validators.js';

const router = Router();

// Solo creación pública. El listado vive en /admin/solicitudes (con auth).
router.post('/', validarSolicitudInfo, postSolicitudInfo);

export default router;
