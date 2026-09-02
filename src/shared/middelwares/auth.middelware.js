const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const response = require('../utils/response');

/**
 * Verifica que el request tenga un JWT válido
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.error(res, 'Token no proporcionado', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return response.error(res, 'Token expirado', 401);
    }
    return response.error(res, 'Token inválido', 401);
  }
};

/**
 * Verifica que el usuario tenga uno de los roles permitidos
 * @param  {...string} roles - Roles permitidos
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return response.error(res, 'No tienes permisos para esta acción', 403);
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };