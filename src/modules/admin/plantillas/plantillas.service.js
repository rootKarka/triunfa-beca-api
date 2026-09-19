import { query } from '../../../config/database.js';

/**
 * Lista las plantillas activas en el formato del frontend (camelCase).
 * DB: respuestas_rapidas (contenido/veces_usada) → Plantilla (mensaje/usos).
 */
export async function listarPlantillas() {
  const { rows } = await query(
    `SELECT id, titulo, categoria, contenido, veces_usada
     FROM respuestas_rapidas
     WHERE es_activa = true
     ORDER BY categoria, titulo`,
  );
  return rows.map((r) => ({
    id: r.id,
    titulo: r.titulo,
    categoria: r.categoria,
    mensaje: r.contenido,
    usos: r.veces_usada,
  }));
}