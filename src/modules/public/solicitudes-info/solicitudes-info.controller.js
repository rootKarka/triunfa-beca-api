import { crearSolicitudInfo } from './solicitudes-info.service.js';

/** POST /api/v1/solicitudes/info — registro público de solicitudes de información */
export const postSolicitudInfo = async (req, res, next) => {
  try {
    const solicitud = await crearSolicitudInfo(req.body);
    res.status(201).json({
      success: true,
      message: 'Solicitud registrada correctamente',
      data: solicitud,
    });
  } catch (error) {
    next(error);
  }
};
