import { query } from '../../../config/database.js';

export const getIngresantesPublicos = async () => {
  const sql = `
    SELECT id,carrera,universidad,modalidad,imagen_url,texto_alt,orden
    FROM ingresantes
    WHERE es_activo=true
      AND es_eliminado=false
    ORDER BY orden ASC, fecha_creacion DESC
  `;

  const result = await query(sql);
  return result.rows;
};