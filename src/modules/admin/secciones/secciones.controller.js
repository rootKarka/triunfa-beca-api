import {
  getSecciones as getSeccionesService,
  getSeccionById as getSeccionByIdService,
  createSeccion as createSeccionService,
  updateSeccion as updateSeccionService,
  deleteSeccion as deleteSeccionService,
} from './secciones.service.js';

export const getSecciones = async (req, res, next) => {
  try {
    const secciones = await getSeccionesService();
    return res.status(200).json({ success: true, message: 'Secciones obtenidas correctamente', data: secciones });
  } catch (err) { next(err); }
};

export const getSeccionById = async (req, res, next) => {
  try {
    const seccion = await getSeccionByIdService(req.params.id);
    if (!seccion) return res.status(404).json({ success: false, message: 'Sección no encontrada' });
    return res.status(200).json({ success: true, data: seccion });
  } catch (err) { next(err); }
};

export const createSeccion = async (req, res, next) => {
  try {
    const { etiqueta, titulo, descripcion, texto_boton, orden, es_activa } = req.body;
    const seccion = await createSeccionService({
      etiqueta, titulo, descripcion, texto_boton,
      orden: orden !== undefined ? Number(orden) : 0,
      es_activa: es_activa !== undefined ? es_activa : true,
    });
    return res.status(201).json({ success: true, message: 'Sección creada correctamente', data: seccion });
  } catch (err) { next(err); }
};

export const updateSeccion = async (req, res, next) => {
  try {
    const { etiqueta, titulo, descripcion, texto_boton, orden, es_activa } = req.body;
    const campos = {};
    if (etiqueta !== undefined) campos.etiqueta = etiqueta;
    if (titulo !== undefined) campos.titulo = titulo;
    if (descripcion !== undefined) campos.descripcion = descripcion;
    if (texto_boton !== undefined) campos.texto_boton = texto_boton;
    if (orden !== undefined) campos.orden = Number(orden);
    if (es_activa !== undefined) campos.es_activa = es_activa;

    if (!Object.keys(campos).length) return res.status(400).json({ success: false, message: 'No hay campos válidos para actualizar' });

    const seccion = await updateSeccionService(req.params.id, campos);
    if (!seccion) return res.status(404).json({ success: false, message: 'Sección no encontrada' });

    return res.status(200).json({ success: true, message: 'Sección actualizada correctamente', data: seccion });
  } catch (err) { next(err); }
};

export const deleteSeccion = async (req, res, next) => {
  try {
    const seccion = await deleteSeccionService(req.params.id);
    if (!seccion) return res.status(404).json({ success: false, message: 'Sección no encontrada' });
    return res.status(200).json({ success: true, message: 'Sección eliminada correctamente' });
  } catch (err) { next(err); }
};