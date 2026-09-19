import { Router } from 'express';
import {
  deletePlantilla,
  getPlantillas,
  postPlantilla,
  putPlantilla,
} from './plantillas.controller.js';
import { authMiddleware } from '../../../shared/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getPlantillas);
router.post('/', postPlantilla);
router.put('/:id', putPlantilla);
router.delete('/:id', deletePlantilla);

export default router;