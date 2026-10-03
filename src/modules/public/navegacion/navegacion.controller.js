import { getNavegacionPublica } from './navegacion.service.js';

export const getNavegacion = async (req, res, next) => {
  try {
    const navegacion = await getNavegacionPublica();
    res.status(200).json({ status: 'success', data: navegacion });
  } catch (error) {
    next(error);
  }
};