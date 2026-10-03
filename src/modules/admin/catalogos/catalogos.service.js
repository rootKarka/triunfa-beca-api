import { query } from '../../../config/database.js';
import { registrarAuditoria } from '../auditoria/auditoria.service.js';

const auditar = (usuarioId,accion,data,descripcion,detalle={}) =>
  registrarAuditoria({
    usuarioId,
    accion,
    entidad:'CATALOGO_OPCION',
    entidadId:data.id,
    descripcion,
    detalle,
  });

export const obtenerOpcionesAdmin = async (codigo) => {
  const sql = `SELECT o.id,o.nombre,o.activo,o.orden
    FROM catalogo_opciones o
    INNER JOIN catalogos c ON c.id=o.catalogo_id
    WHERE c.codigo=$1 AND o.eliminado=false
    ORDER BY o.orden,o.nombre`;

  const result = await query(sql,[codigo]);
  return result.rows;
};

export const crearOpcion = async (codigo,nombre,orden=0,usuarioId=null) => {
  const sql = `INSERT INTO catalogo_opciones(catalogo_id,nombre,activo,eliminado,orden)
    SELECT id,$2,true,false,$3 FROM catalogos
    WHERE codigo=$1 AND activo=true
    RETURNING id,nombre,activo,orden`;

  const result = await query(sql,[codigo,nombre,orden]);
  const data = result.rows[0] || null;

  if(data) await auditar(
    usuarioId,'CREAR',data,`Opción "${data.nombre}" creada`,
    { codigo, orden:data.orden }
  );

  return data;
};

export const actualizarOpcion = async (id,nombre,orden,usuarioId=null) => {
  const sql = `UPDATE catalogo_opciones SET nombre=$2,orden=$3
    WHERE id=$1 AND eliminado=false
    RETURNING id,nombre,activo,orden`;

  const result = await query(sql,[id,nombre,orden]);
  const data = result.rows[0] || null;

  if(data) await auditar(
    usuarioId,'EDITAR',data,`Opción "${data.nombre}" actualizada`,
    { orden:data.orden }
  );

  return data;
};

export const cambiarEstadoOpcion = async (id,activo,usuarioId=null) => {
  const sql = `UPDATE catalogo_opciones SET activo=$2
    WHERE id=$1 AND eliminado=false
    RETURNING id,nombre,activo,orden`;

  const result = await query(sql,[id,activo]);
  const data = result.rows[0] || null;

  if(data) {
    const accion = activo ? 'MOSTRAR' : 'OCULTAR';
    const estado = activo ? 'mostrada' : 'ocultada';
    await auditar(usuarioId,accion,data,`Opción "${data.nombre}" ${estado}`);
  }

  return data;
};

export const eliminarOpcion = async (id,usuarioId=null) => {
  const sql = `UPDATE catalogo_opciones SET eliminado=true,activo=false
    WHERE id=$1 AND eliminado=false
    RETURNING id,nombre,activo,orden`;

  const result = await query(sql,[id]);
  const data = result.rows[0] || null;

  if(data) await auditar(
    usuarioId,'ELIMINAR',data,`Opción "${data.nombre}" eliminada lógicamente`
  );

  return data;
};