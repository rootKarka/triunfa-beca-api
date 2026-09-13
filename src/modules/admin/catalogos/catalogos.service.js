import { query } from '../../../config/database.js';

export const obtenerOpcionesAdmin = async (codigo) => {
  const sql = `SELECT o.id,o.nombre,o.activo,o.orden FROM catalogo_opciones o
  INNER JOIN catalogos c ON c.id=o.catalogo_id WHERE c.codigo=$1 ORDER BY o.orden,o.nombre`;
  const result = await query(sql,[codigo]);
  return result.rows;
};

export const crearOpcion = async (codigo,nombre,orden=0) => {
  const sql = `INSERT INTO catalogo_opciones(catalogo_id,nombre,orden)
  SELECT id,$2,$3 FROM catalogos WHERE codigo=$1
  RETURNING id,nombre,activo,orden`;
  const result = await query(sql,[codigo,nombre,orden]);
  return result.rows[0] || null;
};

export const actualizarOpcion = async (id,nombre,orden) => {
  const sql = `UPDATE catalogo_opciones SET nombre=$2,orden=$3
  WHERE id=$1 RETURNING id,nombre,activo,orden`;
  const result = await query(sql,[id,nombre,orden]);
  return result.rows[0] || null;
};

export const cambiarEstadoOpcion = async (id,activo) => {
  const sql = `UPDATE catalogo_opciones SET activo=$2 WHERE id=$1
  RETURNING id,nombre,activo,orden`;
  const result = await query(sql,[id,activo]);
  return result.rows[0] || null;
};