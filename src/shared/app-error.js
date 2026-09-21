/**
 * Error de aplicación con código HTTP asociado.
 * Úsalo para errores controlados que el error handler
 * global serializa con el envelope estándar.
 */
export class AppError extends Error {
  /**
   * @param {number} statusCode - Código HTTP (400, 401, 404, ...)
   * @param {string} message - Mensaje para el cliente
   */
  constructor(statusCode, message) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
