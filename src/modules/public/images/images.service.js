import { query } from '../../../config/database.js';

export const getImagenes = async (seccion) => {
  let sql = `
    SELECT id, url, texto_alt, seccion, grupo, orden, es_activa, fecha_creacion
    FROM imagenes
    WHERE es_activa = true
  `;
  const params = [];

  if (seccion) {
    params.push(seccion);
    sql += ` AND seccion = $${params.length}`;
  }

  sql += ' ORDER BY orden ASC, fecha_creacion DESC';

  const result = await query(sql, params);
  return result.rows;
};

export const getImagenById = async (id) => {
  const sql = `
    SELECT id, url, texto_alt, seccion, grupo, orden, es_activa, fecha_creacion
    FROM imagenes
    WHERE id = $1 AND es_activa = true
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};