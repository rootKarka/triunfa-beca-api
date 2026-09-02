const { query } = require('../../../config/database');

const getSolicitudes = async ({ tipo, estado, page, limit }) => {
  const offset = (page - 1) * limit;
  const params = [];
  let whereClauses = [];

  if (tipo) {
    params.push(tipo);
    whereClauses.push(`tipo = $${params.length}`);
  }
  if (estado) {
    params.push(estado);
    whereClauses.push(`estado = $${params.length}`);
  }

  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*) as total FROM solicitudes_informacion ${where}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const dataSql = `
    SELECT * FROM solicitudes_informacion ${where}
    ORDER BY fecha_solicitud DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  const dataResult = await query(dataSql, [...params, limit, offset]);

  return { data: dataResult.rows, total };
};

const getSolicitudById = async (id) => {
  const sql = 'SELECT * FROM solicitudes_informacion WHERE id = $1';
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

const actualizarEstado = async (id, estado, usuarioId) => {
  const sql = `
    UPDATE solicitudes_informacion
    SET estado = $1
    WHERE id = $2
    RETURNING id, nombres_apellidos, estado, fecha_solicitud
  `;
  const result = await query(sql, [estado, id]);

  if (result.rows.length === 0) return null;

  // TODO: Registrar en tabla de auditoría
  // await query('INSERT INTO auditoria (...) VALUES (...)', [...]);

  return result.rows[0];
};

module.exports = { getSolicitudes, getSolicitudById, actualizarEstado };