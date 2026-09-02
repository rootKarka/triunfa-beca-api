const response = require('../utils/response');

/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);

  if (err.name === 'ValidationError') {
    return response.error(res, 'Datos de entrada inválidos', 400, err.details);
  }

  if (err.name === 'UnauthorizedError') {
    return response.error(res, 'No autorizado', 401);
  }

  if (err.code === '23505') {
    return response.error(res, 'El registro ya existe (duplicado)', 409);
  }

  if (err.code === '23503') {
    return response.error(res, 'Referencia inválida (clave foránea)', 400);
  }

  return response.error(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
    500
  );
};

module.exports = errorHandler;