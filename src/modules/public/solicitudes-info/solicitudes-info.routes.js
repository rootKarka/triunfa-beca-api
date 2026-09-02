import { Router } from "express";
import { postSolicitudInfo, getSolicitudesInfo } from "./solicitudes-info.controller.js";

const router = Router();

// Ruta pública para que el frontend envíe el formulario
router.post('/informacion', postSolicitudInfo);

// Ruta para el admin (más adelante le pondremos middleware de auth)
router.get('/informacion', getSolicitudesInfo);

export default router;