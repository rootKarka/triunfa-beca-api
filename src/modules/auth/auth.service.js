const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../../config/database');
const env = require('../../config/env');

const login = async (correo, password) => {
  const sql = 'SELECT id, nombre, correo, password_hash, role FROM usuarios WHERE correo = $1';
  const result = await query(sql, [correo]);
  const usuario = result.rows[0];

  if (!usuario) return null;

  const isValid = await bcrypt.compare(password, usuario.password_hash);
  if (!isValid) return null;

  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, role: usuario.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
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
};

module.exports = { login };