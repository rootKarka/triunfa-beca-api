const { validationResult } = require('express-validator');
const response = require('../utils/response');

/**
 * Middleware que verifica los resultados de express-validator
 * Colocar DESPUÉS de las reglas de validación en la ruta
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return response.error(res, 'Errores de validación', 400, formattedErrors);
  }

  next();
};

module.exports = validate;