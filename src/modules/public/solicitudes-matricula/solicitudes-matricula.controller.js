import * as matriculaService from './solicitudes-matriculas.service.js';

/*
 *  POST  /api/solicitudes-matricula
 */
export const postMatriculaInfo = async (req, res) => {
    try {
        const nuevaSolicitud = await matriculaService.crearSolicitudMatricula(req.body);
        
        return res.status(201).json({
            success: true,
            message: 'Solicitud de matricula creada correctamente jijiji',
            data: nuevaSolicitud
        });
    } catch (error) {
        console.error('Error al crear solicitud pipipi: ', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno deel serviddor al procesar solicitud, lo siento blo'
        });
    }
};

export const getMatriculaInfo = async (req, res) => {
    try {
        const solicitudes = await matriculaService.obtenerTodas();
        return res.status(200).json({
            success: true,
            message: 'Esta es una prueba de message',
            data: solicitudes
        });
    } catch (error) {
        console.error('Error al obtener las matriculas: ',  error);
        return res.status(500).json({
            success:  false,
            message: 'Error interno del servidor, lo siento amiwito'
        });
    }
};