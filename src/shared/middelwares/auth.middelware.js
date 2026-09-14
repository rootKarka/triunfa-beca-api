import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Token no proporcionado' });

  try {
    req.user = jwt.verify(authHeader.split(' ')[1], env.jwt.secret);
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    return res.status(401).json({ success: false, message });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'No tienes permisos para esta acción' });
  next();
};