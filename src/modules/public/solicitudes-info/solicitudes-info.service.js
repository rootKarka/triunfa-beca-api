import { query } from '../../../config/database.js';

export const crearSolicitudInfo = async (datos) => {
  const {
    nombres_apellidos,
    dni,
    celular,
    correo,
    nivel_educativo,
    servicio_interes,
    mensaje,
    canal_preferido
  } = datos;

  const text = `
    INSERT INTO solicitudes_informacion
    (nombres_apellidos, dni, celular, correo, nivel_educativo, servicio_interes,
    mensaje, canal_preferido)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, nombres_apellidos, correo, fecha_solicitud, estado;
  `;

  const values = [
    nombres_apellidos,
    dni,
    celular,
    correo,
    nivel_educativo,
    servicio_interes,
    mensaje || null,
    canal_preferido || 'WhastApp'
  ];

  const result = await query(text, values);
  return result.rows[0];

};

export const obtenerTodasLasSolicitudes = async () => {
  const text = `SELECT * FROM solicitudes_informacion ORDER BY fecha_solicitud DESC`;
  const  result = await query(text);
  return result.rows;

};