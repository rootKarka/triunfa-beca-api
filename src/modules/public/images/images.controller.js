import {
  getImagenes as getImagenesService,
  getImagenById as getImagenByIdService,
} from './images.service.js';

export const getImagenes = async (req, res, next) => {
  try {
    const imagenes = await getImagenesService(req.query.seccion);
    res.status(200).json({ success: true, message: 'Imágenes obtenidas correctamente', data: imagenes });
  } catch (err) { next(err); }
};

export const getImagenById = async (req, res, next) => {
  try {
    const imagen = await getImagenByIdService(req.params.id);
    if (!imagen) return res.status(404).json({ success: false, message: 'Imagen no encontrada' });
    res.status(200).json({ success: true, data: imagen });
  } catch (err) { next(err); }
};