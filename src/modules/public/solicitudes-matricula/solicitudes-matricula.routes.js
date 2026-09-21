import { Router } from 'express';
import { postSolicitudMatricula } from './solicitudes-matricula.controller.js';
import { validarSolicitudMatricula } from './solicitudes-matricula.validators.js';

const router = Router();

// Solo creación pública. El listado vive en /admin/solicitudes (con auth).
router.post('/', validarSolicitudMatricula, postSolicitudMatricula);

export default router;
