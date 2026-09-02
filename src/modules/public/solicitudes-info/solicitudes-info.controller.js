import { crearSolicitudInfo, obtenerTodasLasSolicitudes } from "./solicitudes-info.service.js";

export const postSolicitudInfo = async (req, res) => {
  try {
    const nuevaSolicitud = await crearSolicitudInfo(req.body);

    return res.status(201).json({
      succes: true,
      message: 'Solicitud de informacion registrada correctamente jeje',
      data: nuevaSolicitud
    });
  } catch (error){
    console.error('Error al crear solicitud pipipi: ', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar solicitud, lo siento amiko'
    });
  }
};

export const getSolicitudesInfo = async (req, res) => {
  try {
    const solicitudes = await obtenerTodasLasSolicitudes();
    return res.status(200).json({
      succes: true,
      data: solicitudes
    });
  } catch (error) {
    console.error('Error al obtener solicitudes pipipi: '. error);
    return res.status(500).json({
      succes: false,
      message: 'Error interno del servidor, lo siento amiko'
    });
  }
}