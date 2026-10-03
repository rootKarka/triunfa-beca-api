import { query } from '../../../config/database.js';

export const obtenerOpcionesPorCatalogo = async (codigo) => {
  const text = `
    SELECT o.id, o.nombre, o.orden
    FROM catalogo_opciones o
    INNER JOIN catalogos c ON c.id = o.catalogo_id
    WHERE c.codigo = $1
      AND c.activo = true
      AND o.activo = true
      AND o.eliminado = false
    ORDER BY o.orden, o.nombre;
  `;
  const result = await query(text, [codigo]);
  return result.rows;
};