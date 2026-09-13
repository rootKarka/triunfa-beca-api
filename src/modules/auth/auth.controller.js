import { login as loginService } from './auth.service.js';

export const login = async (req,res,next) => {
  try {
    const resultado=await loginService(req.body.correo,req.body.password);
    if(!resultado) return res.status(401).json({success:false,message:'Credenciales inválidas'});
    return res.status(200).json({success:true,message:'Inicio de sesión exitoso',data:resultado});
  } catch(error) { next(error); }
};