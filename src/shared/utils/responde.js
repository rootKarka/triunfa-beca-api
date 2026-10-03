/**
 * Respuesta exitosa estandarizada
 */
const success = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Respuesta de error estandarizada
 */
const error = (res, message = 'Error interno del servidor', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

/**
 * Respuesta de paginación
 */
const paginated = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    message: 'Datos obtenidos correctamente',
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

module.exports = { success, error, paginated };