import {
  getSecciones as getSeccionesService,
  getSeccionById as getSeccionByIdService,
  createSeccion as createSeccionService,
  updateSeccion as updateSeccionService,
  deleteSeccion as deleteSeccionService,
} from './secciones.service.js';

const usuarioId = (req) => req.user?.id ?? null;

export const getSecciones = async (req,res,next) => {
  try {
    const data = await getSeccionesService();
    res.status(200).json({ success:true, message:'Secciones obtenidas correctamente', data });
  } catch(err) { next(err); }
};

export const getSeccionById = async (req,res,next) => {
  try {
    const data = await getSeccionByIdService(req.params.id);
    if(!data) return res.status(404).json({ success:false, message:'Sección no encontrada' });
    res.status(200).json({ success:true, data });
  } catch(err) { next(err); }
};

export const createSeccion = async (req,res,next) => {
  try {
    const { etiqueta,titulo,descripcion,texto_boton,orden,es_activa } = req.body;

    const data = await createSeccionService({
      etiqueta, titulo, descripcion, texto_boton,
      orden:orden !== undefined ? Number(orden) : 0,
      es_activa:es_activa !== undefined ? es_activa : true,
      usuarioId:usuarioId(req),
    });

    res.status(201).json({ success:true, message:'Sección creada correctamente', data });
  } catch(err) { next(err); }
};

export const updateSeccion = async (req,res,next) => {
  try {
    const { etiqueta,titulo,descripcion,texto_boton,orden,es_activa } = req.body;
    const campos = {};

    if(etiqueta !== undefined) campos.etiqueta = etiqueta;
    if(titulo !== undefined) campos.titulo = titulo;
    if(descripcion !== undefined) campos.descripcion = descripcion;
    if(texto_boton !== undefined) campos.texto_boton = texto_boton;
    if(orden !== undefined) campos.orden = Number(orden);
    if(es_activa !== undefined) campos.es_activa = es_activa;

    if(!Object.keys(campos).length)
      return res.status(400).json({ success:false, message:'No hay campos válidos para actualizar' });

    const data = await updateSeccionService(req.params.id,campos,usuarioId(req));
    if(!data) return res.status(404).json({ success:false, message:'Sección no encontrada' });

    res.status(200).json({ success:true, message:'Sección actualizada correctamente', data });
  } catch(err) { next(err); }
};

export const deleteSeccion = async (req,res,next) => {
  try {
    const data = await deleteSeccionService(req.params.id,usuarioId(req));
    if(!data) return res.status(404).json({ success:false, message:'Sección no encontrada' });

    res.status(200).json({ success:true, message:'Sección eliminada correctamente' });
  } catch(err) { next(err); }
};