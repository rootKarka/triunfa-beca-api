import {
  getNavegacion as getNavegacionService,
  getNavegacionById as getNavegacionByIdService,
  createNavegacion as createNavegacionService,
  updateNavegacion as updateNavegacionService,
  deleteNavegacion as deleteNavegacionService,
} from './navegacion.service.js';

export const getNavegacion = async (req, res, next) => {
  try {
    const items = await getNavegacionService();
    return res.status(200).json({ success: true, message: 'Navegación obtenida correctamente', data: items });
  } catch (err) { next(err); }
};

export const getNavegacionById = async (req, res, next) => {
  try {
    const item = await getNavegacionByIdService(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Elemento no encontrado' });
    return res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const createNavegacion = async (req, res, next) => {
  try {
    const { nombre, enlace, padre_id, orden, es_activo } = req.body;
    const item = await createNavegacionService({
      nombre, enlace, padre_id: padre_id || null,
      orden: orden !== undefined ? Number(orden) : 0,
      es_activo: es_activo !== undefined ? es_activo : true,
    });
    return res.status(201).json({ success: true, message: 'Elemento creado correctamente', data: item });
  } catch (err) { next(err); }
};

export const updateNavegacion = async (req, res, next) => {
  try {
    const { nombre, enlace, padre_id, orden, es_activo } = req.body;
    const campos = {};

    if (nombre !== undefined) campos.nombre = nombre;
    if (enlace !== undefined) campos.enlace = enlace;
    if (padre_id !== undefined) campos.padre_id = padre_id || null;
    if (orden !== undefined) campos.orden = Number(orden);
    if (es_activo !== undefined) campos.es_activo = es_activo;

    if (!Object.keys(campos).length)
      return res.status(400).json({ success: false, message: 'No hay campos válidos para actualizar' });

    const item = await updateNavegacionService(req.params.id, campos);
    if (!item) return res.status(404).json({ success: false, message: 'Elemento no encontrado' });

    return res.status(200).json({ success: true, message: 'Elemento actualizado correctamente', data: item });
  } catch (err) { next(err); }
};

export const deleteNavegacion = async (req, res, next) => {
  try {
    const item = await deleteNavegacionService(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Elemento no encontrado' });
    return res.status(200).json({ success: true, message: 'Elemento eliminado correctamente' });
  } catch (err) { next(err); }
};