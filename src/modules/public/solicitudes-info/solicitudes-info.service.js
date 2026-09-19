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

export const crearSolicitudInfo = async (datos) => {
  const {
    nombres_apellidos,
    dni,
    celular,
    correo,
    nivel_educativo,
    servicio_interes,
    mensaje,
    canal_preferido,
  } = datos;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const codigo = await generarCodigo(client);

    const { rows } = await client.query(
      `INSERT INTO solicitudes_informacion
         (codigo, nombres_apellidos, dni, celular, correo, nivel_educativo,
          servicio_interes, mensaje, canal_preferido)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING codigo, correo, fecha_solicitud, estado`,
      [
        codigo,
        nombres_apellidos,
        dni,
        celular,
        correo,
        nivel_educativo,
        servicio_interes,
        mensaje ?? null,
        canal_preferido ?? 'WhatsApp',
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
