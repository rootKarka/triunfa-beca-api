import { pool } from '../../../config/database.js';

/** Genera el código correlativo SOL-#### dentro de la transacción activa. */
async function generarCodigo(client) {
  const { rows } = await client.query(
    `INSERT INTO contadores (clave, valor) VALUES ('solicitudes', 1)
     ON CONFLICT (clave) DO UPDATE SET valor = contadores.valor + 1
     RETURNING valor`,
  );
  return `SOL-${String(rows[0].valor).padStart(4, '0')}`;
}

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
    apod_correo,
  } = datos;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const codigo = await generarCodigo(client);

    const { rows } = await client.query(
      `INSERT INTO solicitudes_matricula
         (codigo, est_nombres, est_apellido_paterno, est_apellido_materno, est_dni,
          est_fecha_nacimiento, est_celular, est_correo, nivel_educativo,
          grado_modalidad, servicio_contratar, turno_preferido,
          apod_nombre_completo, apod_dni, apod_celular, apod_correo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING codigo, est_correo, fecha_solicitud, estado`,
      [
        codigo,
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
        apod_correo ?? null,
      ],
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
