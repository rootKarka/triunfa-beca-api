import { listarPlantillas } from './plantillas.service.js';

/** GET /api/v1/admin/plantillas — biblioteca de respuestas rápidas (auth) */
export async function getPlantillas(req, res, next) {
  try {
    const data = await listarPlantillas();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}