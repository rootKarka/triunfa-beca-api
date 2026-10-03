import { getSeccionesPublicas } from './secciones.service.js';

export const getSecciones = async (req, res, next) => {
  try {
    const secciones = await getSeccionesPublicas();
    res.status(200).json({ status: 'success', data: secciones });
  } catch (error) {
    next(error);
  }
};