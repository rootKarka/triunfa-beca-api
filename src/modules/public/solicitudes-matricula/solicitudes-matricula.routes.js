import { Router } from "express";
import { postSolicitudMatricula, getSolicitudesMatricula } from "./solicitudes-matricula.controller.js";

const router = Router();

router.post('/matricula', postSolicitudMatricula);
router.get('/matricula', getSolicitudesMatricula);

export default router;