import { query } from '../../../config/database.js';
import { buildPublicUrl, deleteFile } from './imagenes.upload.js';
import { registrarAuditoria } from '../auditoria/auditoria.service.js';

const auditar = (usuarioId,accion,imagen,descripcion,detalle={}) =>
  registrarAuditoria({ usuarioId, accion, entidad:'IMAGEN', entidadId:imagen.id, descripcion, detalle });

const getFilename = (url) => url?.split('/').pop() || null;

export const getImagenes = async (seccion) => {
  let sql = `SELECT id,url,texto_alt,seccion,grupo,orden,es_activa,fecha_creacion FROM imagenes`;
  const params = [];

  if(seccion) {
    params.push(seccion);
    sql += ` WHERE seccion=$${params.length}`;
  }

  sql += ' ORDER BY orden ASC, fecha_creacion DESC';
  const result = await query(sql,params);
  return result.rows;
};

export const getImagenById = async (id) => {
  const sql = `SELECT id,url,texto_alt,seccion,grupo,orden,es_activa,fecha_creacion
    FROM imagenes WHERE id=$1`;
  const result = await query(sql,[id]);
  return result.rows[0] || null;
};

export const createImagen = async ({
  archivo,seccion,grupo,texto_alt,orden,es_activa,usuarioId=null,
}) => {
  const filename = archivo.filename;
  const publicUrl = buildPublicUrl(filename);

  const sql = `INSERT INTO imagenes(url,texto_alt,seccion,grupo,orden,es_activa)
    VALUES($1,$2,$3,$4,$5,$6)
    RETURNING id,url,texto_alt,seccion,grupo,orden,es_activa,fecha_creacion`;

  try {
    const result = await query(sql,[
      publicUrl, texto_alt || null, seccion, grupo || null,
      orden ?? 0, es_activa ?? true,
    ]);

    const imagen = result.rows[0];
    await auditar(usuarioId,'CREAR',imagen,`Imagen agregada en "${imagen.seccion}"`,
      { grupo:imagen.grupo, orden:imagen.orden });

    return imagen;
  } catch(error) {
    try { deleteFile(filename); } catch {}
    throw error;
  }
};

export const updateImagen = async (id,campos,archivo=null,usuarioId=null) => {
  const actual = await getImagenById(id);

  if(!actual) {
    if(archivo?.filename) {
      try { deleteFile(archivo.filename); } catch {}
    }
    return null;
  }

  const permitidos = ['texto_alt','seccion','grupo','orden','es_activa'];
  const actualizaciones = [];
  const params = [id];

  for(const [campo,valor] of Object.entries(campos)) {
    if(!permitidos.includes(campo) || valor === undefined) continue;
    actualizaciones.push(`${campo}=$${params.length + 1}`);
    params.push(valor);
  }

  if(archivo) {
    actualizaciones.push(`url=$${params.length + 1}`);
    params.push(buildPublicUrl(archivo.filename));
  }

  if(!actualizaciones.length) return actual;

  const sql = `UPDATE imagenes SET ${actualizaciones.join(', ')}
    WHERE id=$1
    RETURNING id,url,texto_alt,seccion,grupo,orden,es_activa,fecha_creacion`;

  let imagen;

  try {
    const result = await query(sql,params);
    imagen = result.rows[0] || null;
  } catch(error) {
    if(archivo?.filename) {
      try { deleteFile(archivo.filename); } catch {}
    }
    throw error;
  }

  if(!imagen) return null;

  const camposEditados = [...Object.keys(campos), ...(archivo ? ['archivo'] : [])];
  const soloEstado = !archivo && camposEditados.length === 1 && campos.es_activa !== undefined;
  const accion = soloEstado ? (imagen.es_activa ? 'MOSTRAR' : 'OCULTAR') : 'EDITAR';
  const descripcion = soloEstado
    ? `Imagen ${imagen.es_activa ? 'mostrada' : 'ocultada'} en "${imagen.seccion}"`
    : `Imagen actualizada en "${imagen.seccion}"`;

  await auditar(usuarioId,accion,imagen,descripcion,{ campos:camposEditados });

  if(archivo && actual.url !== imagen.url) {
    const filenameAnterior = getFilename(actual.url);
    if(filenameAnterior) {
      try { deleteFile(filenameAnterior); }
      catch(error) { console.error('No se pudo eliminar la imagen anterior:',error); }
    }
  }

  return imagen;
};

export const deleteImagen = async (id,usuarioId=null) => {
  const sql = `DELETE FROM imagenes WHERE id=$1
    RETURNING id,url,texto_alt,seccion,grupo,orden,es_activa,fecha_creacion`;

  const result = await query(sql,[id]);
  const imagen = result.rows[0] || null;
  if(!imagen) return null;

  await auditar(usuarioId,'ELIMINAR',imagen,`Imagen eliminada de "${imagen.seccion}"`,
    { grupo:imagen.grupo });

  const filename = getFilename(imagen.url);
  if(filename) {
    try { deleteFile(filename); }
    catch(error) { console.error('No se pudo eliminar el archivo físico de la imagen:',error); }
  }

  return imagen;
};