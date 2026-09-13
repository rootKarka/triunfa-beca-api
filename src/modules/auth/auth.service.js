import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/database.js';
import env from '../../config/env.js';

export const login = async (correo,password) => {
  const result = await query('SELECT id,nombre,correo,password_hash,role,es_activo FROM usuarios WHERE correo=$1',[correo]);
  const usuario=result.rows[0];
  if(!usuario || !usuario.es_activo) return null;

  const valido=await bcrypt.compare(password,usuario.password_hash);
  if(!valido) return null;

  const token=jwt.sign({id:usuario.id,correo:usuario.correo,role:usuario.role},env.jwt.secret,{expiresIn:env.jwt.expiresIn});
  return {token,usuario:{id:usuario.id,nombre:usuario.nombre,correo:usuario.correo,role:usuario.role}};
};