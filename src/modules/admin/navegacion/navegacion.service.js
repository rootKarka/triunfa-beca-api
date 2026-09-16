import { query } from '../../../config/database.js';

export const getNavegacion = async () => {
  const result = await query(`
    SELECT id, nombre, enlace, padre_id, orden, es_activo, fecha_creacion, fecha_actualizacion
    FROM navegacion ORDER BY padre_id NULLS FIRST, orden ASC, fecha_creacion ASC
  `);
  return result.rows;
};

export const getNavegacionById = async (id) => {
  const result = await query(`
    SELECT id, nombre, enlace, padre_id, orden, es_activo, fecha_creacion, fecha_actualizacion
    FROM navegacion WHERE id = $1
  `, [id]);
  return result.rows[0] || null;
};

export const createNavegacion = async ({ nombre, enlace, padre_id, orden, es_activo }) => {
  const result = await query(`
    INSERT INTO navegacion (nombre, enlace, padre_id, orden, es_activo)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, nombre, enlace, padre_id, orden, es_activo, fecha_creacion, fecha_actualizacion
  `, [nombre, enlace || '#', padre_id || null, orden ?? 0, es_activo ?? true]);
  return result.rows[0];
};

export const updateNavegacion = async (id, campos) => {
  const permitidos = ['nombre', 'enlace', 'padre_id', 'orden', 'es_activo'];
  const updates = [], params = [id];
  let index = 2;

  for (const [campo, valor] of Object.entries(campos)) {
    if (permitidos.includes(campo) && valor !== undefined) {
      updates.push(`${campo} = $${index++}`);
      params.push(valor);
    }
  }

  if (!updates.length) return null;

  const result = await query(`
    UPDATE navegacion SET ${updates.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, nombre, enlace, padre_id, orden, es_activo, fecha_creacion, fecha_actualizacion
  `, params);

  return result.rows[0] || null;
};

export const deleteNavegacion = async (id) => {
  const result = await query(`
    DELETE FROM navegacion WHERE id = $1
    RETURNING id, nombre, enlace, padre_id, orden, es_activo
  `, [id]);
  return result.rows[0] || null;
};