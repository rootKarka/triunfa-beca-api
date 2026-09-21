import { query } from '../../../config/database.js';

export const getNavegacionPublica = async () => {
  const result = await query(`
    SELECT id, nombre, enlace, padre_id, orden
    FROM navegacion
    WHERE es_activo = true
    ORDER BY padre_id NULLS FIRST, orden ASC
  `);
  return result.rows;
};