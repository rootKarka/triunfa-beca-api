const service = require('./auth.service');
const response = require('../../shared/utils/response');

const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;
    const result = await service.login(correo, password);

    if (!result) {
      return response.error(res, 'Credenciales inválidas', 401);
    }

    return response.success(res, result, 'Inicio de sesión exitoso');
  } catch (err) {
    next(err);
  }
};

module.exports = { login };