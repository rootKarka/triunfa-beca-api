import { AppError } from './app-error.js';

/** 404 - Ruta no encontrada */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
}

/**
 * Error handler global (debe registrarse ÚLTIMO en app.js).
 * - AppError → status + message controlados.
 * - Errores inesperados → 500 genérico (sin filtrar detalles al cliente).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Cuerpo de la petición inválido (JSON malformado)',
    });
  }

  console.error('Error no controlado:', err);
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
}
