import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

/**
 * Middleware para verificar JWT en la cabecera Authorization: Bearer <token>
 * Inyecta el payload verificado en req.user y req.usuario para garantizar compatibilidad.
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    // Asignamos a ambas propiedades para evitar fallos en controladores existentes
    req.user = decoded;
    req.usuario = decoded;

    return next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token expirado'
        : 'Token inválido';

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

// Exportamos alias para los archivos que importan `verifyToken`
export const verifyToken = authMiddleware;

/**
 * Middleware de autorización por rol (ej: requireRole('admin', 'superadmin'))
 */
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    const user = req.user || req.usuario;

    if (!user || !rolesPermitidos.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para esta acción',
      });
    }

    return next();
  };
};

export default authMiddleware;