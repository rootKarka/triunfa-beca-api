import {
  getNavegacion as getNavegacionService,
  getNavegacionById as getNavegacionByIdService,
  createNavegacion as createNavegacionService,
  updateNavegacion as updateNavegacionService,
  deleteNavegacion as deleteNavegacionService,
} from './navegacion.service.js';

const usuarioId = (req) => req.user?.id ?? null;

export const getNavegacion = async (req,res,next) => {
  try {
    const data = await getNavegacionService();
    res.status(200).json({ success:true, message:'Navegación obtenida correctamente', data });
  } catch(err) { next(err); }
};

export const getNavegacionById = async (req,res,next) => {
  try {
    const data = await getNavegacionByIdService(req.params.id);
    if(!data) return res.status(404).json({ success:false, message:'Elemento no encontrado' });
    res.status(200).json({ success:true, data });
  } catch(err) { next(err); }
};

export const createNavegacion = async (req,res,next) => {
  try {
    const { nombre,enlace,padre_id,orden,es_activo } = req.body;

    const data = await createNavegacionService({
      nombre, enlace, padre_id:padre_id || null,
      orden:orden !== undefined ? Number(orden) : 0,
      es_activo:es_activo !== undefined ? es_activo : true,
      usuarioId:usuarioId(req),
    });

    res.status(201).json({ success:true, message:'Elemento creado correctamente', data });
  } catch(err) { next(err); }
};

export const updateNavegacion = async (req,res,next) => {
  try {
    const { nombre,enlace,padre_id,orden,es_activo } = req.body;
    const campos = {};

    if(nombre !== undefined) campos.nombre = nombre;
    if(enlace !== undefined) campos.enlace = enlace;
    if(padre_id !== undefined) campos.padre_id = padre_id || null;
    if(orden !== undefined) campos.orden = Number(orden);
    if(es_activo !== undefined) campos.es_activo = es_activo;

    if(!Object.keys(campos).length)
      return res.status(400).json({ success:false, message:'No hay campos válidos para actualizar' });

    const data = await updateNavegacionService(req.params.id,campos,usuarioId(req));
    if(!data) return res.status(404).json({ success:false, message:'Elemento no encontrado' });

    res.status(200).json({ success:true, message:'Elemento actualizado correctamente', data });
  } catch(err) { next(err); }
};

export const deleteNavegacion = async (req,res,next) => {
  try {
    const data = await deleteNavegacionService(req.params.id,usuarioId(req));
    if(!data) return res.status(404).json({ success:false, message:'Elemento no encontrado' });

    res.status(200).json({ success:true, message:'Elemento eliminado correctamente' });
  } catch(err) { next(err); }
};