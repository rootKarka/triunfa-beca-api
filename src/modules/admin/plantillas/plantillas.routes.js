import { Router } from 'express';
import {
  deletePlantilla,
  getPlantillas,
  postPlantilla,
  putPlantilla,
} from './plantillas.controller.js';
import { authMiddleware } from '../../../shared/middelwares/auth.middelware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getPlantillas);
router.post('/', postPlantilla);
router.put('/:id', putPlantilla);
router.delete('/:id', deletePlantilla);

export default router;