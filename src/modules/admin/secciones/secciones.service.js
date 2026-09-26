import { query } from '../../../config/database.js';
import { registrarAuditoria } from '../auditoria/auditoria.service.js';

const camposSeccion = `
  id, etiqueta, titulo, descripcion, texto_boton,
  orden, es_activa, fecha_creacion, fecha_actualizacion
`;

const auditar = (usuarioId,accion,seccion,descripcion,detalle={}) =>
  registrarAuditoria({
    usuarioId,
    accion,
    entidad:'SECCION',
    entidadId:seccion.id,
    descripcion,
    detalle,
  });

export const getSecciones = async () => {
  const result = await query(`
    SELECT ${camposSeccion}
    FROM secciones
    ORDER BY orden ASC, fecha_creacion ASC
  `);
  return result.rows;
};

export const getSeccionById = async (id) => {
  const result = await query(`
    SELECT ${camposSeccion}
    FROM secciones
    WHERE id=$1
  `,[id]);

  return result.rows[0] || null;
};

export const createSeccion = async ({
  etiqueta,titulo,descripcion,texto_boton,orden,es_activa,usuarioId=null,
}) => {
  const result = await query(`
    INSERT INTO secciones(etiqueta,titulo,descripcion,texto_boton,orden,es_activa)
    VALUES($1,$2,$3,$4,$5,$6)
    RETURNING ${camposSeccion}
  `,[
    etiqueta, titulo, descripcion || null, texto_boton || null,
    orden ?? 0, es_activa ?? true,
  ]);

  const seccion = result.rows[0];

  await auditar(
    usuarioId,'CREAR',seccion,
    `Sección "${seccion.etiqueta}" creada`,
    { titulo:seccion.titulo }
  );

  return seccion;
};

export const updateSeccion = async (id,campos,usuarioId=null) => {
  const permitidos = ['etiqueta','titulo','descripcion','texto_boton','orden','es_activa'];
  const updates = [], params = [id];

  for(const [campo,valor] of Object.entries(campos)) {
    if(!permitidos.includes(campo) || valor === undefined) continue;
    updates.push(`${campo}=$${params.length + 1}`);
    params.push(valor);
  }

  if(!updates.length) return null;

  const result = await query(`
    UPDATE secciones
    SET ${updates.join(', ')}, fecha_actualizacion=CURRENT_TIMESTAMP
    WHERE id=$1
    RETURNING ${camposSeccion}
  `,params);

  const seccion = result.rows[0] || null;

  if(seccion) {
    const soloEstado = Object.keys(campos).length === 1 && campos.es_activa !== undefined;
    const accion = soloEstado ? (seccion.es_activa ? 'MOSTRAR' : 'OCULTAR') : 'EDITAR';
    const descripcion = soloEstado
      ? `Sección "${seccion.etiqueta}" ${seccion.es_activa ? 'mostrada' : 'ocultada'}`
      : `Sección "${seccion.etiqueta}" actualizada`;

    await auditar(usuarioId,accion,seccion,descripcion,{ campos:Object.keys(campos) });
  }

  return seccion;
};

export const deleteSeccion = async (id,usuarioId=null) => {
  const result = await query(`
    DELETE FROM secciones
    WHERE id=$1
    RETURNING id,etiqueta,titulo,descripcion,texto_boton,orden,es_activa
  `,[id]);

  const seccion = result.rows[0] || null;

  if(seccion)
    await auditar(usuarioId,'ELIMINAR',seccion,`Sección "${seccion.etiqueta}" eliminada`);

  return seccion;
};