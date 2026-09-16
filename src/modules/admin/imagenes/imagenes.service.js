import { query } from '../../../config/database.js';
import { deleteFile } from './imagenes.upload.js';

export const getImagenes = async (seccion) => {
  let sql = `
    SELECT id, url, texto_alt, seccion, orden, es_activa, fecha_creacion
    FROM imagenes
  `;
  const params = [];

  if (seccion) {
    params.push(seccion);
    sql += ` WHERE seccion = $${params.length}`;
  }

  sql += ' ORDER BY orden ASC, fecha_creacion DESC';

  const result = await query(sql, params);
  return result.rows;
};

export const getImagenById = async (id) => {
  const sql = `
    SELECT id, url, texto_alt, seccion, orden, es_activa, fecha_creacion
    FROM imagenes
    WHERE id = $1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

export const createImagen = async ({
  archivo,
  seccion,
  texto_alt,
  orden,
  es_activa,
}) => {
  const filename = archivo.filename;
  const publicUrl = `/uploads/imagenes/${filename}`;

  const sql = `
    INSERT INTO imagenes (url, texto_alt, seccion, orden, es_activa)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, url, texto_alt, seccion, orden, es_activa, fecha_creacion
  `;

  const params = [
    publicUrl,
    texto_alt || null,
    seccion,
    orden ?? 0,
    es_activa ?? true,
  ];

  try {
    const result = await query(sql, params);
    return result.rows[0];
  } catch (error) {
    await deleteFile(filename);
    throw error;
  }
};

export const updateImagen = async (id, campos) => {
  const permitidos = ['texto_alt', 'seccion', 'orden', 'es_activa'];
  const actualizaciones = [];
  const params = [id];
  let paramIndex = 2;

  for (const [campo, valor] of Object.entries(campos)) {
    if (permitidos.includes(campo) && valor !== undefined) {
      actualizaciones.push(`${campo} = $${paramIndex}`);
      params.push(valor);
      paramIndex++;
    }
  }

  if (actualizaciones.length === 0) {
    return null;
  }

  const sql = `
    UPDATE imagenes
    SET ${actualizaciones.join(', ')}
    WHERE id = $1
    RETURNING id, url, texto_alt, seccion, orden, es_activa, fecha_creacion
  `;

  const result = await query(sql, params);
  return result.rows[0] || null;
};

export const deleteImagen = async (id) => {
  const sql = `
    DELETE FROM imagenes
    WHERE id = $1
    RETURNING id, url, texto_alt, seccion, orden, es_activa, fecha_creacion
  `;

  const result = await query(sql, [id]);
  const imagen = result.rows[0];

  if (!imagen) {
    return null;
  }

  const filename = imagen.url.split('/').pop();

  if (filename) {
    try {
      await deleteFile(filename);
    } catch (error) {
      console.error('No se pudo eliminar el archivo físico de la imagen:', error);
    }
  }

  return imagen;
};