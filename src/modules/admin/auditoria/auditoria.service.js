import { query } from '../../../config/database.js';

export const registrarAuditoria = async ({
  usuarioId,
  accion,
  entidad,
  entidadId = null,
  descripcion,
  detalle = {},
}) => {
  const sql = `
    INSERT INTO auditoria
      (usuario_id, accion, entidad, entidad_id, descripcion, detalle)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, usuario_id, accion, entidad, entidad_id,
              descripcion, detalle, fecha_creacion;
  `;

  const result = await query(sql, [
    usuarioId,
    accion,
    entidad,
    entidadId,
    descripcion,
    JSON.stringify(detalle),
  ]);

  return result.rows[0];
};

export const obtenerAuditoriaReciente = async (limite = 5) => {
  const sql = `
    SELECT
      a.id,
      a.accion,
      a.entidad,
      a.entidad_id,
      a.descripcion,
      a.detalle,
      a.fecha_creacion,
      u.id AS usuario_id,
      u.nombre AS usuario_nombre
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    ORDER BY a.fecha_creacion DESC
    LIMIT $1;
  `;

  const result = await query(sql, [limite]);
  return result.rows;
};