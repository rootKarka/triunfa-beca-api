import solicitudesService from './solicitudes.service.js';
import { AppError } from '../../../shared/app-error.js';

class SolicitudesController {
  /** GET /api/v1/admin/solicitudes */
  async getAll(req, res, next) {
    try {
      const result = await solicitudesService.getAll(req.query);
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/v1/admin/solicitudes/estadisticas */
  async getEstadisticas(req, res, next) {
    try {
      const data = await solicitudesService.getEstadisticas();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/v1/admin/solicitudes/:id  (id = código SOL-####) */
  async getById(req, res, next) {
    try {
      const solicitud = await solicitudesService.getById(req.params.id);
      if (!solicitud) throw new AppError(404, 'Solicitud no encontrada');
      res.json({ success: true, data: solicitud });
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/v1/admin/solicitudes/:id/estado  { estado } */
  async updateEstado(req, res, next) {
    try {
      const { estado } = req.body ?? {};
      if (!estado) throw new AppError(400, 'El estado es requerido');

      const result = await solicitudesService.updateEstado(req.params.id, estado);
      if (!result) throw new AppError(404, 'Solicitud no encontrada');

      res.json({
        success: true,
        data: result,
        message: 'Estado actualizado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /** PUT /api/v1/admin/solicitudes/:id/notas  { notas } */
  async updateNotas(req, res, next) {
    try {
      const { notas } = req.body ?? {};
      if (typeof notas !== 'string') throw new AppError(400, 'Las notas son requeridas');

      const result = await solicitudesService.updateNotas(
        req.params.id,
        notas,
        req.usuario?.correo ?? 'Operador',
      );
      if (!result) throw new AppError(404, 'Solicitud no encontrada');

      res.json({
        success: true,
        data: result,
        message: 'Notas guardadas correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/v1/admin/solicitudes/:id/mensajes  { canal, mensaje, plantillaId? } */
  async registrarMensaje(req, res, next) {
    try {
      const { canal, mensaje, plantillaId } = req.body ?? {};

      const result = await solicitudesService.registrarMensaje(
        req.params.id,
        { canal, mensaje, plantillaId },
        req.usuario?.correo ?? 'Operador',
      );
      if (!result) throw new AppError(404, 'Solicitud no encontrada');

      res.status(201).json({
        success: true,
        data: result,
        message: 'Mensaje registrado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SolicitudesController();
