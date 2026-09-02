const service = require('./imagenes.service');
const response = require('../../../shared/utils/response');

const getImagenes = async (req, res, next) => {
  try {
    const { seccion } = req.query;
    const imagenes = await service.getImagenes(seccion);
    return response.success(res, imagenes, 'Imágenes obtenidas correctamente');
  } catch (err) {
    next(err);
  }
};

const getImagenById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imagen = await service.getImagenById(id);

    if (!imagen) {
      return response.error(res, 'Imagen no encontrada', 404);
    }

    return response.success(res, imagen);
  } catch (err) {
    next(err);
  }
};

module.exports = { getImagenes, getImagenById };