import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Protege rutas admin verificando el JWT en el header:
 *   Authorization: Bearer <token>
 * Si es válido, inyecta req.usuario = { sub, correo, role }.
 */
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido',
    });
  }

  try {
    req.usuario = jwt.verify(token, env.jwt.secret);
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
}

/** Middleware de autorización por rol (ej: requireRole('admin')) */
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para esta acción',
      });
    }
    return next();
  };
}
