import { query } from '../../../config/database.js';
import { AppError } from '../../../shared/app-error.js';

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
  return rows.map(mapearPlantilla);
}

/** Crea una plantilla nueva. UNIQUE(titulo) → 409 si ya existe. */
export async function crearPlantilla({ titulo, categoria, mensaje }) {
  try {
    const { rows } = await query(
      `INSERT INTO respuestas_rapidas (titulo, categoria, contenido)
       VALUES ($1, $2, $3)
       RETURNING id, titulo, categoria, contenido, veces_usada`,
      [titulo.trim(), categoria, mensaje.trim()],
    );
    return mapearPlantilla(rows[0]);
  } catch (error) {
    if (error?.code === '23505') {
      throw new AppError(409, 'Ya existe una respuesta rápida con ese título');
    }
    throw error;
  }
}

/** Edita título/categoría/contenido. El contador de usos se conserva. */
export async function actualizarPlantilla(id, { titulo, categoria, mensaje }) {
  try {
    const { rows } = await query(
      `UPDATE respuestas_rapidas
       SET titulo = $2, categoria = $3, contenido = $4,
           fecha_actualizacion = now()
       WHERE id = $1 AND es_activa = true
       RETURNING id, titulo, categoria, contenido, veces_usada`,
      [id, titulo.trim(), categoria, mensaje.trim()],
    );
    return rows[0] ? mapearPlantilla(rows[0]) : null;
  } catch (error) {
    if (error?.code === '23505') {
      throw new AppError(409, 'Ya existe una respuesta rápida con ese título');
    }
    throw error;
  }
}

/** Baja lógica: la plantilla desaparece de la lista pero la auditoría
 *  (comunicaciones_enviadas) conserva su historial. */
export async function desactivarPlantilla(id) {
  const { rows } = await query(
    `UPDATE respuestas_rapidas SET es_activa = false, fecha_actualizacion = now()
     WHERE id = $1 AND es_activa = true
     RETURNING id`,
    [id],
  );
  return rows[0] ?? null;
}

function mapearPlantilla(r) {
  return {
    id: r.id,
    titulo: r.titulo,
    categoria: r.categoria,
    mensaje: r.contenido,
    usos: r.veces_usada,
  };
}