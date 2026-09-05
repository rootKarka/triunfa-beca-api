import { query } from "../../../config/database.js";

const ESTADOS_VALIDOS = [
    'PENDIENTE',
    'CONTACTADO',
    'EN_PROCESO',
    'MATRICULADO',
    'RECHAZADO',
];

/* 
 *  Crea una nueva solicitud de matricula
 */

export const crearSolicitudMatricula = async (data) => {
    const text = `
        INSERT INTO solicitudes_matricula (
            est_nombres, est_apellido_paterno, est_apellido_materno,
            est_dni, est_fecha_nacimiento, est_celular, est_correo,
            nivel_educativo, grado_modalidad, servicio_contratar, turno_preferido,
            apod_nombre_completo, apod_dni, apod_celular, apod_correo
            ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11,
            $12, $13, $14, $15
        )
        RETURNING *;
    `;

    const values = [
        data.est_nombres.trim(),
        data.est_apellido_paterno.trim(),
        data.est_apellido_materno.trim(),
        data.est_dni.trim(),
        data.est_fecha_nacimiento,
        data.est_celular.trim(),
        data.est_correo.trim(),
        data.nivel_educativo,
        data.grado_modalidad.trim(),
        data.servicio_contratar.trim(),
        data.turno_preferido,
        data.apod_nombre_completo.trim(),
        data.apod_dni.trim(),
        data.apod_celular.trim(),
        data.apod_correo?.trim() || null,
    ];

    const result = await query(text, values);
    return result.rows[0];
};

/*
 *  Obtiene  todas las solicitudes de matricula
 */

export const obtenerTodas = async () => {
    const result = await query(
        'SELECT * FROM solicitudes_matricula ORDER BY fecha_solicitud DESC'
    );
    return  result.rows;
};

/**
 * Obtiene una solicitud por su ID (UUID).
 */
export const obtenerPorId = async (id) => {
  const result = await query(
    'SELECT * FROM solicitudes_matricula WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Actualiza el estado de una solicitud.
 */
export const actualizarEstado = async (id, nuevoEstado) => {
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    const error = new Error('Estado no válido');
    error.code = 'VALIDATION_ERROR';
    error.details = [`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`];
    throw error;
  }

  const result = await query(
    `UPDATE solicitudes_matricula
     SET estado = $1
     WHERE id = $2
     RETURNING *`,
    [nuevoEstado, id]
  );

  return result.rows[0] || null;
  
};