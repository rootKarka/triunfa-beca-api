import {
  getIngresantes as getIngresantesService,
  getIngresanteById as getIngresanteByIdService,
  createIngresante as createIngresanteService,
  updateIngresante as updateIngresanteService,
  deleteIngresante as deleteIngresanteService,
} from './ingresantes.service.js';
import { broadcast } from '../../../shared/events/broadcaster.js';

export const getIngresantes = async (_req, res, next) => {
  try {
    const ingresantes = await getIngresantesService();
    res.status(200).json({ success: true, data: ingresantes });
  } catch (error) {
    next(error);
  }
};

export const getIngresanteById = async (req, res, next) => {
  try {
    const ingresante = await getIngresanteByIdService(req.params.id);

    if (!ingresante) {
      return res.status(404).json({
        success: false,
        message: 'Ingresante no encontrado',
      });
    }

    res.status(200).json({ success: true, data: ingresante });
  } catch (error) {
    next(error);
  }
};

export const createIngresante = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'La imagen es obligatoria',
      });
    }

    const { carrera, universidad, modalidad, texto_alt, orden, es_activo } = req.body;

    const ingresante = await createIngresanteService({
      archivo: req.file,
      carrera: carrera.trim(),
      universidad: universidad.trim(),
      modalidad: modalidad?.trim() || null,
      texto_alt: texto_alt?.trim() || null,
      orden: orden !== undefined ? parseInt(orden, 10) : 0,
      es_activo:
        es_activo !== undefined
          ? typeof es_activo === 'boolean'
            ? es_activo
            : es_activo === 'true'
          : true,
    });

    broadcast('ingresantes', {
      accion: 'creado',
      id: ingresante.id,
    });

    res.status(201).json({
      success: true,
      message: 'Ingresante creado correctamente',
      data: ingresante,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIngresante = async (req, res, next) => {
  try {
    const { carrera, universidad, modalidad, texto_alt, orden, es_activo } = req.body;
    const campos = {};

    if (carrera !== undefined) campos.carrera = carrera.trim();
    if (universidad !== undefined) campos.universidad = universidad.trim();
    if (modalidad !== undefined) campos.modalidad = modalidad.trim() || null;
    if (texto_alt !== undefined) campos.texto_alt = texto_alt.trim() || null;
    if (orden !== undefined) campos.orden = parseInt(orden, 10);

    if (es_activo !== undefined) {
      campos.es_activo =
        typeof es_activo === 'boolean'
          ? es_activo
          : es_activo === 'true';
    }

    if (!Object.keys(campos).length && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos válidos para actualizar',
      });
    }

    const ingresante = await updateIngresanteService(
      req.params.id,
      campos,
      req.file || null,
    );

    if (!ingresante) {
      return res.status(404).json({
        success: false,
        message: 'Ingresante no encontrado',
      });
    }

    broadcast('ingresantes', {
      accion: 'actualizado',
      id: ingresante.id,
    });

    res.status(200).json({
      success: true,
      message: 'Ingresante actualizado correctamente',
      data: ingresante,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIngresante = async (req, res, next) => {
  try {
    const ingresante = await deleteIngresanteService(req.params.id);

    if (!ingresante) {
      return res.status(404).json({
        success: false,
        message: 'Ingresante no encontrado',
      });
    }

    broadcast('ingresantes', {
      accion: 'eliminado',
      id: ingresante.id,
    });

    res.status(200).json({
      success: true,
      message: 'Ingresante eliminado correctamente',
      data: ingresante,
    });
  } catch (error) {
    next(error);
  }
};