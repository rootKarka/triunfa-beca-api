import {
  getImagenes as getImagenesService,
  getImagenById as getImagenByIdService,
  createImagen as createImagenService,
  updateImagen as updateImagenService,
  deleteImagen as deleteImagenService,
} from './imagenes.service.js';

const usuarioId = (req) => req.user?.id ?? null;

export const getImagenes = async (req,res,next) => {
  try {
    const imagenes = await getImagenesService(req.query.seccion);
    res.status(200).json({ success:true, message:'Imágenes obtenidas correctamente', data:imagenes });
  } catch(err) { next(err); }
};

export const getImagenById = async (req,res,next) => {
  try {
    const imagen = await getImagenByIdService(req.params.id);
    if(!imagen) return res.status(404).json({ success:false, message:'Imagen no encontrada' });
    res.status(200).json({ success:true, data:imagen });
  } catch(err) { next(err); }
};

export const createImagen = async (req,res,next) => {
  try {
    if(!req.file) return res.status(400).json({ success:false, message:'El archivo es obligatorio' });

    const { seccion,grupo,texto_alt,orden,es_activa } = req.body;
    if(!seccion) return res.status(400).json({ success:false, message:'La sección es obligatoria' });

    const imagen = await createImagenService({
      archivo:req.file,
      seccion,
      grupo:grupo || null,
      texto_alt:texto_alt || null,
      orden:orden ? parseInt(orden,10) : 0,
      es_activa:es_activa !== undefined ? es_activa === 'true' : true,
      usuarioId:usuarioId(req),
    });

    res.status(201).json({ success:true, message:'Imagen registrada correctamente', data:imagen });
  } catch(err) { next(err); }
};

export const updateImagen = async (req,res,next) => {
  try {
    const { texto_alt,seccion,grupo,orden,es_activa } = req.body;
    const campos = {};

    if(texto_alt !== undefined) campos.texto_alt = texto_alt;
    if(seccion !== undefined) campos.seccion = seccion;
    if(grupo !== undefined) campos.grupo = grupo;
    if(orden !== undefined) campos.orden = parseInt(orden,10);
    if(es_activa !== undefined) campos.es_activa =
      typeof es_activa === 'boolean' ? es_activa : es_activa === 'true';

    if(!Object.keys(campos).length)
      return res.status(400).json({ success:false, message:'No hay campos válidos para actualizar' });

    const imagen = await updateImagenService(req.params.id,campos,usuarioId(req));
    if(!imagen) return res.status(404).json({ success:false, message:'Imagen no encontrada' });

    res.status(200).json({ success:true, message:'Imagen actualizada correctamente', data:imagen });
  } catch(err) { next(err); }
};

export const deleteImagen = async (req,res,next) => {
  try {
    const imagen = await deleteImagenService(req.params.id,usuarioId(req));
    if(!imagen) return res.status(404).json({ success:false, message:'Imagen no encontrada' });

    res.status(200).json({ success:true, message:'Imagen eliminada correctamente' });
  } catch(err) { next(err); }
};