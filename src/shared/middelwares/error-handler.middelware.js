import { AppError } from '../app-error.js';
import env from '../../config/env.js'; // O process.env si no usas env.js aquí

/** 
 * 404 - Handler para rutas no encontradas
 */
export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
}

/**
 * Middleware global de manejo de errores (debe ser el ÚLTIMO middleware registrado)
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Log detallado en consola para depuración
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // 1. Error personalizado de la aplicación (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // 2. Errores de validación (ej. Joi, Zod, Express-Validator)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      ...(err.details && { details: err.details }),
    });
  }

  // 3. Error de autorización
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'No autorizado',
    });
  }

  // 4. Errores conocidos de PostgreSQL / Base de Datos
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe (duplicado)',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida (clave foránea)',
    });
  }

  // 5. JSON malformado en el cuerpo de la petición
  if (err?.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err)) {
    return res.status(400).json({
      success: false,
      message: 'Cuerpo de la petición inválido (JSON malformado)',
    });
  }

  // 6. Error no controlado (500)
  const isDev = (env?.nodeEnv || process.env.NODE_ENV) === 'development';
  return res.status(500).json({
    success: false,
    message: isDev ? err.message : 'Error interno del servidor',
  });
}

export default errorHandler;