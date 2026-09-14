import { obtenerOpcionesPorCatalogo } from './catalogos.service.js';

export const getOpcionesCatalogo = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const opciones = await obtenerOpcionesPorCatalogo(codigo);
    res.status(200).json({ status: 'success', data: opciones });
  } catch (error) {
    next(error);
  }
};