import { query } from '../../../config/database.js';
import { registrarAuditoria } from '../auditoria/auditoria.service.js';

const campos = `
  id,nombre,enlace,padre_id,orden,es_activo,
  fecha_creacion,fecha_actualizacion
`;

const auditar = (usuarioId,accion,item,descripcion,detalle={}) =>
  registrarAuditoria({
    usuarioId,
    accion,
    entidad:'NAVEGACION',
    entidadId:item.id,
    descripcion,
    detalle,
  });

export const getNavegacion = async () => {
  const result = await query(`
    SELECT ${campos} FROM navegacion
    ORDER BY padre_id NULLS FIRST, orden ASC, fecha_creacion ASC
  `);
  return result.rows;
};

export const getNavegacionById = async (id) => {
  const result = await query(`
    SELECT ${campos} FROM navegacion WHERE id=$1
  `,[id]);

  return result.rows[0] || null;
};

export const createNavegacion = async ({
  nombre,enlace,padre_id,orden,es_activo,usuarioId=null,
}) => {
  const result = await query(`
    INSERT INTO navegacion(nombre,enlace,padre_id,orden,es_activo)
    VALUES($1,$2,$3,$4,$5)
    RETURNING ${campos}
  `,[nombre,enlace || '#',padre_id || null,orden ?? 0,es_activo ?? true]);

  const item = result.rows[0];

  await auditar(
    usuarioId,'CREAR',item,
    `Elemento de navegación "${item.nombre}" creado`,
    { enlace:item.enlace, padre_id:item.padre_id }
  );

  return item;
};

export const updateNavegacion = async (id,camposUpdate,usuarioId=null) => {
  const permitidos = ['nombre','enlace','padre_id','orden','es_activo'];
  const updates = [], params = [id];

  for(const [campo,valor] of Object.entries(camposUpdate)) {
    if(!permitidos.includes(campo) || valor === undefined) continue;
    updates.push(`${campo}=$${params.length + 1}`);
    params.push(valor);
  }

  if(!updates.length) return null;

  const result = await query(`
    UPDATE navegacion
    SET ${updates.join(', ')}, fecha_actualizacion=CURRENT_TIMESTAMP
    WHERE id=$1
    RETURNING ${campos}
  `,params);

  const item = result.rows[0] || null;

  if(item) {
    const soloEstado = Object.keys(camposUpdate).length === 1 &&
      camposUpdate.es_activo !== undefined;

    const accion = soloEstado
      ? (item.es_activo ? 'MOSTRAR' : 'OCULTAR')
      : 'EDITAR';

    const descripcion = soloEstado
      ? `Elemento "${item.nombre}" ${item.es_activo ? 'mostrado' : 'ocultado'}`
      : `Elemento de navegación "${item.nombre}" actualizado`;

    await auditar(usuarioId,accion,item,descripcion,{
      campos:Object.keys(camposUpdate),
    });
  }

  return item;
};

export const deleteNavegacion = async (id,usuarioId=null) => {
  const result = await query(`
    DELETE FROM navegacion WHERE id=$1
    RETURNING id,nombre,enlace,padre_id,orden,es_activo
  `,[id]);

  const item = result.rows[0] || null;

  if(item)
    await auditar(
      usuarioId,'ELIMINAR',item,
      `Elemento de navegación "${item.nombre}" eliminado`
    );

  return item;
};