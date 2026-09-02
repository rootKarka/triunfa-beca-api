const service = require('./solicitudes.service');
const response = require('../../../shared/utils/response');

const getSolicitudes = async (req, res, next) => {
  try {
    const { tipo, estado, page = 1, limit = 20 } = req.query;
    const result = await service.getSolicitudes({ tipo, estado, page: +page, limit: +limit });
    return response.paginated(res, result.data, result.total, +page, +limit);
  } catch (err) {
    next(err);
  }
};

const getSolicitudById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const solicitud = await service.getSolicitudById(id);

    if (!solicitud) {
      return response.error(res, 'Solicitud no encontrada', 404);
    }

    return response.success(res, solicitud);
  } catch (err) {
    next(err);
  }
};

const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const actualizada = await service.actualizarEstado(id, estado, req.user.id);
    return response.success(res, actualizada, 'Estado actualizado correctamente');
  } catch (err) {
    next(err);
  }
};

module.exports = { getSolicitudes, getSolicitudById, actualizarEstado };