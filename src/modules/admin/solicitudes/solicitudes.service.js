import { pool, query } from '../../../config/database.js';
import { AppError } from '../../../shared/app-error.js';

const ESTADOS_VALIDOS = ['nuevo', 'contacto', 'matriculado', 'descartado'];
const CANALES_VALIDOS = ['WhatsApp', 'Llamada', 'Correo', 'SMS'];
const LIMIT_MAX = 100;

/* ------------------------------------------------------------------ */
/* Mappers                                                             */
/* ------------------------------------------------------------------ */

const toISO = (f) => (f instanceof Date ? f.toISOString() : f);
const toFechaCorta = (f) => {
  if (!f) return null;
  const d = f instanceof Date ? f : new Date(f);
  return d.toISOString().slice(0, 10);
};

/**
 * Fila de la unión (snake_case) → contrato del frontend (camelCase).
 * `id` expone el código correlativo SOL-####, no el UUID.
 */
function mapSolicitud(row) {
  return {
    id: row.codigo,
    tipo: row.tipo,
    estado: row.estado,
    creadaEn: toISO(row.creada_en),
    responsable: row.responsable ?? null,
    nombres: row.nombres,
    apellidoPaterno: row.apellido_paterno ?? null,
    apellidoMaterno: row.apellido_materno ?? null,
    dni: row.dni,
    fechaNacimiento: toFechaCorta(row.fecha_nacimiento),
    celular: row.celular,
    correo: row.correo,
    nivel: row.nivel,
    grado: row.grado ?? null,
    servicio: row.servicio,
    turno: row.turno ?? null,
    mensaje: row.mensaje ?? null,
    apoderadoNombre: row.apod_nombre ?? null,
    apoderadoDni: row.apod_dni ?? null,
    apoderadoCelular: row.apod_celular ?? null,
    apoderadoCorreo: row.apod_correo ?? null,
    notas: row.notas ?? '',
  };
}

/** Ubica una solicitud por su código SOL-#### (usa el cliente dado). */
async function localizar(client, codigo) {
  let r = await client.query(
    `SELECT id, 'INFO' AS tipo_ref, 'informacion' AS tipo, 'solicitudes_informacion' AS tabla
     FROM solicitudes_informacion WHERE codigo = $1`,
    [codigo],
  );
  if (r.rows.length > 0) return r.rows[0];

  r = await client.query(
    `SELECT id, 'MATRICULA' AS tipo_ref, 'matricula' AS tipo, 'solicitudes_matricula' AS tabla
     FROM solicitudes_matricula WHERE codigo = $1`,
    [codigo],
  );
  return r.rows[0] ?? null;
}

/**
 * Upsert del seguimiento: garantiza 1 fila por solicitud.
 * `campos` solo actualiza las claves que se le pasan.
 */
async function upsertSeguimiento(client, tipoRef, solicitudId, campos = {}) {
  const sets = Object.keys(campos)
    .map((k, idx) => `${k} = $${idx + 4}`)
    .join(', ');
  const valores = Object.values(campos);

  await client.query(
    `INSERT INTO seguimiento_respuestas (solicitud_tipo, solicitud_id, estado_seguimiento)
     VALUES ($1, $2, $3)
     ON CONFLICT (solicitud_tipo, solicitud_id)
     DO UPDATE SET ${sets ? `${sets},` : ''} fecha_creacion = seguimiento_respuestas.fecha_creacion`,
    [tipoRef, solicitudId, campos.estado_seguimiento ?? 'nuevo', ...valores],
  );
}

/* ------------------------------------------------------------------ */
/* Service                                                             */
/* ------------------------------------------------------------------ */

class SolicitudesService {
  /**
   * Listado unificado con filtros, búsqueda y paginación.
   * Todas las condiciones usan parámetros ($n) — sin interpolación.
   */
  // Reemplaza el método getAll en src/api/admin/solicitudes/solicitudes.service.js

  async getAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      tipo = '',
      estado = '',
      servicio = '',
      nivel = '',
      fechaDesde = '',
      fechaHasta = '',
    } = filters;

    const pagina = Math.max(1, parseInt(page, 10) || 1);
    const limite = Math.min(LIMIT_MAX, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pagina - 1) * limite;

    const params = [];
    let idx = 0;
    const next = (valor) => {
      params.push(valor);
      return `$${++idx}`;
    };

    const infoConds = ['TRUE'];
    const matConds = ['TRUE'];

    if (tipo === 'informacion') matConds.push('FALSE');
    if (tipo === 'matricula') infoConds.push('FALSE');
    if (estado) {
      const n = next(estado);
      infoConds.push(`estado = ${n}`);
      matConds.push(`estado = ${n}`);
    }
    if (servicio) {
      const n = next(servicio);
      infoConds.push(`servicio_interes = ${n}`);
      matConds.push(`servicio_contratar = ${n}`);
    }
    if (nivel) {
      const n = next(nivel);
      infoConds.push(`nivel_educativo = ${n}`);
      matConds.push(`nivel_educativo = ${n}`);
    }
    if (search) {
      const n = next(`%${search}%`);
      infoConds.push(
        `(nombres_apellidos ILIKE ${n} OR dni ILIKE ${n} OR celular ILIKE ${n} OR correo ILIKE ${n})`,
      );
      matConds.push(
        `((est_nombres || ' ' || est_apellido_paterno || ' ' || est_apellido_materno) ILIKE ${n}
          OR est_dni ILIKE ${n} OR apod_celular ILIKE ${n} OR apod_correo ILIKE ${n}
          OR apod_nombre_completo ILIKE ${n})`,
      );
    }
    if (fechaDesde) {
      const n = next(fechaDesde);
      infoConds.push(`fecha_solicitud::date >= ${n}::date`);
      matConds.push(`fecha_solicitud::date >= ${n}::date`);
    }
    if (fechaHasta) {
      const n = next(fechaHasta);
      infoConds.push(`fecha_solicitud::date <= ${n}::date`);
      matConds.push(`fecha_solicitud::date <= ${n}::date`);
    }

    // 1. Guardamos cuántos parámetros corresponden SOLO a los filtros
    const filterCount = params.length;

    const union = `
      SELECT codigo, id AS uuid, 'INFO' AS tipo_ref, 'informacion' AS tipo, estado,
            fecha_solicitud AS creada_en,
            nombres_apellidos AS nombres, NULL::varchar AS apellido_paterno, NULL::varchar AS apellido_materno,
            dni, NULL::date AS fecha_nacimiento, celular, correo,
            nivel_educativo AS nivel, NULL::varchar AS grado, servicio_interes AS servicio, NULL::varchar AS turno,
            mensaje, NULL::varchar AS apod_nombre, NULL::varchar AS apod_dni,
            NULL::varchar AS apod_celular, NULL::varchar AS apod_correo
      FROM solicitudes_informacion
      WHERE ${infoConds.join(' AND ')}
      UNION ALL
      SELECT codigo, id, 'MATRICULA', 'matricula', estado, fecha_solicitud,
            est_nombres, est_apellido_paterno, est_apellido_materno,
            est_dni, est_fecha_nacimiento, est_celular, est_correo,
            nivel_educativo, grado_modalidad, servicio_contratar, turno_preferido,
            NULL::text, apod_nombre_completo, apod_dni, apod_celular, apod_correo
      FROM solicitudes_matricula
      WHERE ${matConds.join(' AND ')}
    `;

    // 2. dataSql añade los parámetros de paginación al final de `params`
    const dataSql = `
      SELECT s.*, seg.agente_asignado AS responsable, seg.notas_internas AS notas
      FROM (${union}) s
      LEFT JOIN seguimiento_respuestas seg
        ON seg.solicitud_tipo = s.tipo_ref AND seg.solicitud_id = s.uuid
      ORDER BY s.creada_en DESC
      LIMIT ${next(limite)} OFFSET ${next(offset)}
    `;

    const countSql = `SELECT COUNT(*) AS total FROM (${union}) s`;

    // 3. Pasamos únicamente los parámetros de filtro a countSql
    const [result, countResult] = await Promise.all([
      query(dataSql, params),
      query(countSql, params.slice(0, filterCount)),
    ]);

    const total = parseInt(countResult.rows[0].total, 10);
    return {
      data: result.rows.map(mapSolicitud),
      pagination: {
        total,
        page: pagina,
        limit: limite,
        totalPages: Math.ceil(total / limite),
      },
    };
  }

  /** Detalle completo por código SOL-####, con eventos compuestos. */
  async getById(codigo) {
    const info = await query(
      `SELECT codigo, id, 'INFO' AS tipo_ref, 'informacion' AS tipo, estado, fecha_solicitud AS creada_en,
              nombres_apellidos AS nombres, NULL::varchar AS apellido_paterno, NULL::varchar AS apellido_materno,
              dni, NULL::date AS fecha_nacimiento, celular, correo,
              nivel_educativo AS nivel, NULL::varchar AS grado, servicio_interes AS servicio, NULL::varchar AS turno,
              mensaje, NULL::varchar AS apod_nombre, NULL::varchar AS apod_dni,
              NULL::varchar AS apod_celular, NULL::varchar AS apod_correo
       FROM solicitudes_informacion WHERE codigo = $1`,
      [codigo],
    );

    let row = info.rows[0] ?? null;

    if (!row) {
      const mat = await query(
        `SELECT codigo, id, 'MATRICULA' AS tipo_ref, 'matricula' AS tipo, estado, fecha_solicitud AS creada_en,
                est_nombres AS nombres, est_apellido_paterno AS apellido_paterno, est_apellido_materno AS apellido_materno,
                est_dni AS dni, est_fecha_nacimiento AS fecha_nacimiento, est_celular AS celular, est_correo AS correo,
                nivel_educativo AS nivel, grado_modalidad AS grado, servicio_contratar AS servicio, turno_preferido AS turno,
                NULL::text AS mensaje, apod_nombre_completo AS apod_nombre, apod_dni AS apod_dni,
                apod_celular AS apod_celular, apod_correo AS apod_correo
         FROM solicitudes_matricula WHERE codigo = $1`,
        [codigo],
      );
      row = mat.rows[0] ?? null;
    }

    if (!row) return null;

    const [seg, coms] = await Promise.all([
      query(
        `SELECT * FROM seguimiento_respuestas WHERE solicitud_tipo = $1 AND solicitud_id = $2`,
        [row.tipo_ref, row.id],
      ),
      query(
        `SELECT c.id, c.canal, c.mensaje_enviado, c.fecha_envio, c.agente, p.titulo AS plantilla_titulo
         FROM comunicaciones_enviadas c
         LEFT JOIN respuestas_rapidas p ON p.id = c.plantilla_id
         WHERE c.solicitud_tipo = $1 AND c.solicitud_id = $2
         ORDER BY c.fecha_envio ASC`,
        [row.tipo_ref, row.id],
      ),
    ]);

    const seguimiento = seg.rows[0] ?? null;
    const base = mapSolicitud({
      ...row,
      responsable: seguimiento?.agente_asignado ?? null,
      notas: seguimiento?.notas_internas ?? '',
    });

    const eventos = [
      {
        id: `${row.id}-creacion`,
        tipo: 'creacion',
        detalle:
          row.tipo === 'matricula'
            ? 'Solicitud de matrícula recibida desde la web'
            : 'Solicitud de información recibida desde la web',
        autor: 'Sistema',
        fecha: toISO(row.creada_en),
      },
      ...(seguimiento?.fecha_asignacion
        ? [{
            id: `${row.id}-asignacion`,
            tipo: 'asignacion',
            detalle: `Asignado a ${seguimiento.agente_asignado}`,
            autor: 'Sistema',
            fecha: toISO(seguimiento.fecha_asignacion),
          }]
        : []),
      ...coms.rows.map((c) => ({
        id: c.id,
        tipo: 'mensaje',
        detalle: `Mensaje enviado por ${c.canal}${c.plantilla_titulo ? ` usando "${c.plantilla_titulo}"` : ''}`,
        autor: c.agente ?? 'Operador',
        fecha: toISO(c.fecha_envio),
      })),
    ];

    return { ...base, eventos };
  }

  /**
   * Cambia el estado (fuente de verdad: solicitudes_*).
   * Sincroniza seguimiento en la MISMA transacción.
   */
  async updateEstado(codigo, estado) {
    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw new AppError(400, `Estado inválido. Permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const found = await localizar(client, codigo);
      if (!found) {
        await client.query('ROLLBACK');
        return null;
      }

      // Los nombres de tabla vienen de constantes internas, nunca del usuario.
      await client.query(`UPDATE ${found.tabla} SET estado = $1 WHERE id = $2`, [estado, found.id]);
      await upsertSeguimiento(client, found.tipo_ref, found.id, { estado_seguimiento: estado });

      await client.query('COMMIT');
      return { id: codigo, estado };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /** Guarda las notas internas (bitácora del agente). */
  async updateNotas(codigo, notas, agente = 'Operador') {
    if (typeof notas !== 'string' || notas.length > 5000) {
      throw new AppError(400, 'Notas inválidas (máx. 5000 caracteres)');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const found = await localizar(client, codigo);
      if (!found) {
        await client.query('ROLLBACK');
        return null;
      }

      await upsertSeguimiento(client, found.tipo_ref, found.id, {
        notas_internas: notas,
        agente_asignado: agente,
        fecha_asignacion: new Date().toISOString(),
      });

      await client.query('COMMIT');
      return { id: codigo, notas };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Registra un mensaje enviado (auditoría) y:
   * - incrementa el contador de la plantilla (si aplica)
   * - marca fecha_primera_respuesta (KPI)
   * - si el estado era 'nuevo', lo pasa a 'contacto'
   */
  async registrarMensaje(codigo, { canal, mensaje, plantillaId }, agente = 'Operador') {
    if (!CANALES_VALIDOS.includes(canal)) {
      throw new AppError(400, `Canal inválido. Permitidos: ${CANALES_VALIDOS.join(', ')}`);
    }
    if (!mensaje || !mensaje.trim()) {
      throw new AppError(400, 'El mensaje es requerido');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const found = await localizar(client, codigo);
      if (!found) {
        await client.query('ROLLBACK');
        return null;
      }

      // 1. Auditoría del envío
      const com = await client.query(
        `INSERT INTO comunicaciones_enviadas
           (solicitud_tipo, solicitud_id, plantilla_id, canal, mensaje_enviado, agente)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, fecha_envio`,
        [found.tipo_ref, found.id, plantillaId ?? null, canal, mensaje, agente],
      );

      // 2. Contador de la plantilla
      if (plantillaId) {
        await client.query(
          `UPDATE respuestas_rapidas SET veces_usada = veces_usada + 1,
                   fecha_actualizacion = now() WHERE id = $1`,
          [plantillaId],
        );
      }

      // 3. KPI primera respuesta + canal
      await upsertSeguimiento(client, found.tipo_ref, found.id, {
        fecha_primera_respuesta: new Date().toISOString(),
        canal_respuesta: canal,
        agente_asignado: agente,
      });

      // 4. nuevo → contacto (regla de negocio del sistema)
      await client.query(
        `UPDATE ${found.tabla} SET estado = 'contacto' WHERE id = $1 AND estado = 'nuevo'`,
        [found.id],
      );

      await client.query('COMMIT');
      return { id: com.rows[0].id, fechaEnvio: toISO(com.rows[0].fecha_envio) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /** Estadísticas del dashboard. */
  async getEstadisticas() {
    const kpis = await query(
      `SELECT
         (SELECT COUNT(*) FROM solicitudes_informacion)
       + (SELECT COUNT(*) FROM solicitudes_matricula) AS total_solicitudes,
         (SELECT COUNT(*) FROM solicitudes_informacion WHERE estado = 'nuevo')
       + (SELECT COUNT(*) FROM solicitudes_matricula WHERE estado = 'nuevo') AS nuevas_sin_atender,
         (SELECT COUNT(*) FROM solicitudes_matricula
           WHERE estado = 'matriculado'
             AND date_trunc('month', fecha_solicitud) = date_trunc('month', now())) AS matriculas_del_mes`,
    );

    const conversion = await query(
      `SELECT CASE
         WHEN (SELECT COUNT(*) FROM solicitudes_informacion)
            + (SELECT COUNT(*) FROM solicitudes_matricula) = 0 THEN 0
         ELSE ROUND(
           ((SELECT COUNT(*) FROM solicitudes_matricula WHERE estado = 'matriculado')::numeric
            / ((SELECT COUNT(*) FROM solicitudes_informacion)
             + (SELECT COUNT(*) FROM solicitudes_matricula))) * 100, 2)
       END AS tasa`,
    );

    const serie = await query(
      `SELECT dia::date AS fecha,
              COUNT(s.*) FILTER (WHERE s.tipo = 'informacion') AS informacion,
              COUNT(s.*) FILTER (WHERE s.tipo = 'matricula') AS matricula
       FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') AS dia
       LEFT JOIN (
         SELECT fecha_solicitud::date AS fecha, 'informacion' AS tipo FROM solicitudes_informacion
         UNION ALL
         SELECT fecha_solicitud::date, 'matricula' FROM solicitudes_matricula
       ) s ON s.fecha = dia
       GROUP BY dia
       ORDER BY dia ASC`,
    );

    const porServicio = await query(
      `SELECT servicio, COUNT(*)::int AS total
       FROM (
         SELECT servicio_interes AS servicio FROM solicitudes_informacion
         UNION ALL
         SELECT servicio_contratar FROM solicitudes_matricula
       ) s
       GROUP BY servicio
       ORDER BY total DESC`,
    );

    return {
      totalSolicitudes: parseInt(kpis.rows[0].total_solicitudes, 10),
      nuevasSinAtender: parseInt(kpis.rows[0].nuevas_sin_atender, 10),
      matriculasDelMes: parseInt(kpis.rows[0].matriculas_del_mes, 10),
      tasaConversion: parseFloat(conversion.rows[0].tasa),
      ultimos14Dias: serie.rows.map((r) => ({
        fecha: toFechaCorta(r.fecha),
        informacion: parseInt(r.informacion, 10),
        matricula: parseInt(r.matricula, 10),
      })),
      porServicio: porServicio.rows,
    };
  }
}

export default new SolicitudesService();
