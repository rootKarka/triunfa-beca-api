import { obtenerAuditoriaReciente } from './auditoria.service.js';

export const listarAuditoriaReciente = async (req, res) => {
  try {
    const limite = Number(req.query.limite) || 5;
    const data = await obtenerAuditoriaReciente(limite);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error al obtener auditoría:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo obtener la actividad reciente',
    });
  }
};