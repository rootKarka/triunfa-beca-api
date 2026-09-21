import authService from './auth.service.js';
import { AppError } from '../../shared/app-error.js';

class AuthController {
  /** POST /api/v1/admin/auth/login — público */
  async login(req, res, next) {
    try {
      const { correo, password } = req.body ?? {};

      if (!correo || !password) {
        throw new AppError(400, 'Correo y contraseña son requeridos');
      }

      const sesion = await authService.login(String(correo).trim().toLowerCase(), password);

      if (!sesion) {
        throw new AppError(401, 'Credenciales incorrectas');
      }

      res.json({
        success: true,
        message: 'Sesión iniciada correctamente',
        data: sesion,
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/v1/admin/auth/me — requiere authMiddleware */
  async me(req, res, next) {
    try {
      const usuario = await authService.perfil(req.usuario.sub);
      if (!usuario) throw new AppError(401, 'Usuario no encontrado o inactivo');

      res.json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
