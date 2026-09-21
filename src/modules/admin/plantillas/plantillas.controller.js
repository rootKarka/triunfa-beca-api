import { AppError } from '../../../shared/app-error.js';
import {
  actualizarPlantilla,
  crearPlantilla,
  desactivarPlantilla,
  listarPlantillas,
} from './plantillas.service.js';

/** GET /api/v1/admin/plantillas — biblioteca de respuestas rápidas (auth) */
export async function getPlantillas(req, res, next) {
  try {
    const data = await listarPlantillas();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

/** POST /api/v1/admin/plantillas { titulo, categoria, mensaje } */
export async function postPlantilla(req, res, next) {
  try {
    const { titulo, categoria, mensaje } = req.body ?? {};
    if (!titulo?.trim() || !categoria?.trim() || !mensaje?.trim()) {
      throw new AppError(400, 'Título, categoría y mensaje son requeridos');
    }
    const data = await crearPlantilla({ titulo, categoria, mensaje });
    res.status(201).json({ success: true, data, message: 'Respuesta rápida creada' });
  } catch (error) {
    next(error);
  }
}

/** PUT /api/v1/admin/plantillas/:id { titulo, categoria, mensaje } */
export async function putPlantilla(req, res, next) {
  try {
    const { titulo, categoria, mensaje } = req.body ?? {};
    if (!titulo?.trim() || !categoria?.trim() || !mensaje?.trim()) {
      throw new AppError(400, 'Título, categoría y mensaje son requeridos');
    }
    const data = await actualizarPlantilla(req.params.id, { titulo, categoria, mensaje });
    if (!data) throw new AppError(404, 'Respuesta rápida no encontrada');
    res.json({ success: true, data, message: 'Respuesta rápida actualizada' });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/v1/admin/plantillas/:id — baja lógica */
export async function deletePlantilla(req, res, next) {
  try {
    const data = await desactivarPlantilla(req.params.id);
    if (!data) throw new AppError(404, 'Respuesta rápida no encontrada');
    res.json({ success: true, data, message: 'Respuesta rápida eliminada' });
  } catch (error) {
    next(error);
  }
}