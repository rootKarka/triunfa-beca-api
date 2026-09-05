import { Router} from "express";
import { postMatriculaInfo, getMatriculaInfo } from "./solicitudes-matricula.controller.js";

const router = Router();

// Ruta publica para que el frontend envie el formulario
router.post('/matricula', postMatriculaInfo);

// Ruta para el admin (mas adelante le pondremos el  middelware de auth)
router.get('/matricula', getMatriculaInfo);

export default router;
