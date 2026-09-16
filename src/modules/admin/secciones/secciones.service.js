import { query } from '../../../config/database.js';

export const getSecciones = async () => {
  const result = await query(`
    SELECT id, etiqueta, titulo, descripcion, texto_boton, orden, es_activa, fecha_creacion, fecha_actualizacion
    FROM secciones ORDER BY orden ASC, fecha_creacion ASC
  `);
  return result.rows;
};

export const getSeccionById = async (id) => {
  const result = await query(`
    SELECT id, etiqueta, titulo, descripcion, texto_boton, orden, es_activa, fecha_creacion, fecha_actualizacion
    FROM secciones WHERE id = $1
  `, [id]);
  return result.rows[0] || null;
};

export const createSeccion = async ({ etiqueta, titulo, descripcion, texto_boton, orden, es_activa }) => {
  const result = await query(`
    INSERT INTO secciones (etiqueta, titulo, descripcion, texto_boton, orden, es_activa)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, etiqueta, titulo, descripcion, texto_boton, orden, es_activa, fecha_creacion, fecha_actualizacion
  `, [etiqueta, titulo, descripcion || null, texto_boton || null, orden ?? 0, es_activa ?? true]);
  return result.rows[0];
};

export const updateSeccion = async (id, campos) => {
  const permitidos = ['etiqueta', 'titulo', 'descripcion', 'texto_boton', 'orden', 'es_activa'];
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
    UPDATE secciones SET ${updates.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, etiqueta, titulo, descripcion, texto_boton, orden, es_activa, fecha_creacion, fecha_actualizacion
  `, params);

  return result.rows[0] || null;
};

export const deleteSeccion = async (id) => {
  const result = await query(`
    DELETE FROM secciones WHERE id = $1
    RETURNING id, etiqueta, titulo, descripcion, texto_boton, orden, es_activa
  `, [id]);
  return result.rows[0] || null;
};