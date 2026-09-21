import { query } from '../../../config/database.js';

export const getSeccionesPublicas = async () => {
  const result = await query(`
    SELECT id, etiqueta, titulo, descripcion, texto_boton, orden
    FROM secciones
    WHERE es_activa = true
    ORDER BY orden ASC
  `);
  return result.rows;
};