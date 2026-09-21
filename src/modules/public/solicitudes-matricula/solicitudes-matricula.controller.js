import { crearSolicitudMatricula } from './solicitudes-matriculas.service.js';

/** POST /api/v1/solicitudes/matricula — registro público de pre-matrícula */
export const postSolicitudMatricula = async (req, res, next) => {
  try {
    const solicitud = await crearSolicitudMatricula(req.body);
    res.status(201).json({
      success: true,
      message: 'Solicitud de matrícula registrada correctamente',
      data: solicitud,
    });
  } catch (error) {
    next(error);
  }
};
