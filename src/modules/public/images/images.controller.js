import { getImagenes as getImagenesService, getImagenById as getImagenByIdService } from './images.service.js';

export const getImagenes = async (req, res, next) => {
  try {
    const { seccion } = req.query;
    const imagenes = await getImagenesService(seccion);
    return res.status(200).json({
      success: true,
      message: 'Imágenes obtenidas correctamente',
      data: imagenes,
    });
  } catch (err) {
    next(err);
  }
};

export const getImagenById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imagen = await getImagenByIdService(id);

    if (!imagen) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      data: imagen,
    });
  } catch (err) {
    next(err);
  }
};