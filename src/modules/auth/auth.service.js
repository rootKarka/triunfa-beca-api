import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/database.js';
import env from '../../config/env.js';

class AuthService {
  /**
   * Valida credenciales contra la tabla usuarios y devuelve un JWT.
   * @returns {{ token: string, usuario: object } | null}
   */
  async login(correo, password) {
    const result = await query(
      `SELECT id, nombre, correo, password_hash, role, es_activo
       FROM usuarios
       WHERE correo = $1`,
      [correo],
    );

    const usuario = result.rows[0];
    if (!usuario || !usuario.es_activo) return null;

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) return null;

    const token = jwt.sign(
      { sub: usuario.id, correo: usuario.correo, role: usuario.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn },
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        role: usuario.role,
      },
    };
  }

  /** Datos del usuario autenticado (a partir del payload del JWT) */
  async perfil(usuarioId) {
    const result = await query(
      `SELECT id, nombre, correo, role
       FROM usuarios
       WHERE id = $1 AND es_activo = true`,
      [usuarioId],
    );
    return result.rows[0] ?? null;
  }
}

export default new AuthService();
