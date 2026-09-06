import { crearSolicitudMatricula, obtenerTodasLasMatriculas } from "./solicitudes-matriculas.service.js";

export const postSolicitudMatricula = async (req, res) => {
  try {
    const nuevaMatricula = await crearSolicitudMatricula(req.body);
    return res.status(201).json({
      success: true,
      message: 'Solicitud de matricula registrada correctamente',
      data: nuevaMatricula
    });
  } catch (error) {
    console.error('Error al crear solicitud de matricula: ', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar la matricula'
    });
  }
};

export const getSolicitudesMatricula = async (req, res) => {
  try {
    const matriculas = await obtenerTodasLasMatriculas();
    return res.status(200).json({
      success: true,
      data: matriculas
    });
  } catch (error) {
    console.error('Error al obtener matriculas: ', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};