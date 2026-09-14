import { query } from '../../../config/database.js';

export const crearSolicitudMatricula = async (datos) => {
  const {
    est_nombres,
    est_apellido_paterno,
    est_apellido_materno,
    est_dni,
    est_fecha_nacimiento,
    est_celular,
    est_correo,
    nivel_educativo,
    grado_modalidad,
    servicio_contratar,
    turno_preferido,
    apod_nombre_completo,
    apod_dni,
    apod_celular,
    apod_correo
  } = datos;

  const text = `
    INSERT INTO solicitudes_matricula
    (est_nombres, est_apellido_paterno, est_apellido_materno, est_dni,
     est_fecha_nacimiento, est_celular, est_correo, nivel_educativo,
     grado_modalidad, servicio_contratar, turno_preferido,
     apod_nombre_completo, apod_dni, apod_celular, apod_correo)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id, est_nombres, est_correo, fecha_solicitud, estado;
  `;

  const values = [
    est_nombres,
    est_apellido_paterno,
    est_apellido_materno,
    est_dni,
    est_fecha_nacimiento,
    est_celular,
    est_correo,
    nivel_educativo,
    grado_modalidad,
    servicio_contratar,
    turno_preferido,
    apod_nombre_completo,
    apod_dni,
    apod_celular,
    apod_correo || null
  ];

  const result = await query(text, values);
  return result.rows[0];
};

export const obtenerTodasLasMatriculas = async () => {
  const text = `SELECT * FROM solicitudes_matricula ORDER BY fecha_solicitud DESC`;
  const result = await query(text);
  return result.rows;
};