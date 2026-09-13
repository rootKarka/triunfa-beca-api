import * as service from './catalogos.service.js';

export const listarOpciones = async (req,res,next) => {
  try {
    const data=await service.obtenerOpcionesAdmin(req.params.codigo);
    res.status(200).json({success:true,data});
  } catch(error) { next(error); }
};

export const agregarOpcion = async (req,res,next) => {
  try {
    const data=await service.crearOpcion(req.params.codigo,req.body.nombre,req.body.orden);
    if(!data) return res.status(404).json({success:false,message:'Catálogo no encontrado'});
    res.status(201).json({success:true,message:'Opción agregada correctamente',data});
  } catch(error) {
    if(error.code==='23505') return res.status(409).json({success:false,message:'La opción ya existe'});
    next(error);
  }
};

export const editarOpcion = async (req,res,next) => {
  try {
    const data=await service.actualizarOpcion(req.params.id,req.body.nombre,req.body.orden);
    if(!data) return res.status(404).json({success:false,message:'Opción no encontrada'});
    res.status(200).json({success:true,message:'Opción actualizada correctamente',data});
  } catch(error) {
    if(error.code==='23505') return res.status(409).json({success:false,message:'La opción ya existe'});
    next(error);
  }
};

export const actualizarEstado = async (req,res,next) => {
  try {
    const data=await service.cambiarEstadoOpcion(req.params.id,req.body.activo);
    if(!data) return res.status(404).json({success:false,message:'Opción no encontrada'});
    res.status(200).json({success:true,message:'Estado actualizado correctamente',data});
  } catch(error) { next(error); }
};