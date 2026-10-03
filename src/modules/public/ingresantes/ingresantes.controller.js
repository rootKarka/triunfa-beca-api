import { getIngresantesPublicos } from './ingresantes.service.js';

export const getIngresantes = async (req, res, next) => {
  try {
    const ingresantes = await getIngresantesPublicos();

    res.status(200).json({
      success: true,
      data: ingresantes,
    });
  } catch (error) {
    next(error);
  }
};