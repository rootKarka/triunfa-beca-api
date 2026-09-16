import {
  getImagenes as getImagenesService,
  getImagenById as getImagenByIdService,
  createImagen as createImagenService,
  updateImagen as updateImagenService,
  deleteImagen as deleteImagenService,
} from './imagenes.service.js';

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

export const createImagen = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'El archivo es obligatorio',
      });
    }

    const { seccion, texto_alt, orden, es_activa } = req.body;

    if (!seccion) {
      return res.status(400).json({
        success: false,
        message: 'La sección es obligatoria',
      });
    }

    const imagen = await createImagenService({
      archivo: req.file,
      seccion,
      texto_alt: texto_alt || null,
      orden: orden ? parseInt(orden, 10) : 0,
      es_activa: es_activa !== undefined ? es_activa === 'true' : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Imagen registrada correctamente',
      data: imagen,
    });
  } catch (err) {
    next(err);
  }
};

export const updateImagen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { texto_alt, seccion, orden, es_activa } = req.body;

    const campos = {};

    if (texto_alt !== undefined) campos.texto_alt = texto_alt;
    if (seccion !== undefined) campos.seccion = seccion;
    if (orden !== undefined) campos.orden = parseInt(orden, 10);
    if (es_activa !== undefined) campos.es_activa = es_activa;

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos válidos para actualizar',
      });
    }

    const imagen = await updateImagenService(id, campos);

    if (!imagen) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Imagen actualizada correctamente',
      data: imagen,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteImagen = async (req, res, next) => {
  try {
    const { id } = req.params;

    const imagen = await deleteImagenService(id);

    if (!imagen) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Imagen eliminada correctamente',
    });
  } catch (err) {
    next(err);
  }
};