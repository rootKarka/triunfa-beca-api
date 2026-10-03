import { query } from '../../../config/database.js';
import { buildPublicUrl, deleteFile } from './ingresantes.upload.js';

const getFilename = (url) => url?.split('/').pop() || null;

export const getIngresantes = async () => {
  const sql = `
    SELECT id,carrera,universidad,modalidad,imagen_url,texto_alt,
           orden,es_activo,fecha_creacion,fecha_actualizacion
    FROM ingresantes
    WHERE es_eliminado=false
    ORDER BY orden ASC, fecha_creacion DESC
  `;

  const result = await query(sql);
  return result.rows;
};

export const getIngresanteById = async (id) => {
  const sql = `
    SELECT id,carrera,universidad,modalidad,imagen_url,texto_alt,
           orden,es_activo,fecha_creacion,fecha_actualizacion
    FROM ingresantes
    WHERE id=$1 AND es_eliminado=false
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

export const createIngresante = async ({
  archivo, carrera, universidad, modalidad,
  texto_alt, orden, es_activo,
}) => {
  const imagenUrl = buildPublicUrl(archivo.filename);

  const sql = `
    INSERT INTO ingresantes(
      carrera,universidad,modalidad,imagen_url,texto_alt,orden,es_activo
    )
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING id,carrera,universidad,modalidad,imagen_url,texto_alt,
              orden,es_activo,fecha_creacion,fecha_actualizacion
  `;

  try {
    const result = await query(sql, [
      carrera, universidad, modalidad || null, imagenUrl,
      texto_alt || null, orden ?? 0, es_activo ?? true,
    ]);

    return result.rows[0];
  } catch (error) {
    try { deleteFile(archivo.filename); } catch {}
    throw error;
  }
};

export const updateIngresante = async (id, campos, archivo = null) => {
  const actual = await getIngresanteById(id);

  if (!actual) {
    if (archivo?.filename) {
      try { deleteFile(archivo.filename); } catch {}
    }
    return null;
  }

  const permitidos = [
    'carrera', 'universidad', 'modalidad',
    'texto_alt', 'orden', 'es_activo',
  ];

  const actualizaciones = [];
  const params = [id];

  for (const [campo, valor] of Object.entries(campos)) {
    if (!permitidos.includes(campo) || valor === undefined) continue;
    actualizaciones.push(`${campo}=$${params.length + 1}`);
    params.push(valor);
  }

  if (archivo) {
    actualizaciones.push(`imagen_url=$${params.length + 1}`);
    params.push(buildPublicUrl(archivo.filename));
  }

  if (!actualizaciones.length) return actual;

  actualizaciones.push('fecha_actualizacion=now()');

  const sql = `
    UPDATE ingresantes
    SET ${actualizaciones.join(', ')}
    WHERE id=$1 AND es_eliminado=false
    RETURNING id,carrera,universidad,modalidad,imagen_url,texto_alt,
              orden,es_activo,fecha_creacion,fecha_actualizacion
  `;

  let ingresante;

  try {
    const result = await query(sql, params);
    ingresante = result.rows[0] || null;
  } catch (error) {
    if (archivo?.filename) {
      try { deleteFile(archivo.filename); } catch {}
    }
    throw error;
  }

  if (archivo && ingresante && actual.imagen_url !== ingresante.imagen_url) {
    const anterior = getFilename(actual.imagen_url);

    if (anterior) {
      try { deleteFile(anterior); }
      catch (error) {
        console.error('No se pudo eliminar la imagen anterior:', error);
      }
    }
  }

  return ingresante;
};

export const deleteIngresante = async (id) => {
  const sql = `
    UPDATE ingresantes
    SET es_eliminado=true,
        es_activo=false,
        fecha_eliminacion=now(),
        fecha_actualizacion=now()
    WHERE id=$1 AND es_eliminado=false
    RETURNING id,carrera,universidad,modalidad,imagen_url,texto_alt,
              orden,es_activo,fecha_creacion,fecha_actualizacion
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};