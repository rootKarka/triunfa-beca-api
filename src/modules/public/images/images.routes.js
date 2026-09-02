const { Router } = require('express');
const controller = require('./imagenes.controller');

const router = Router();

// GET /api/v1/public/imagenes?seccion=hero
router.get('/', controller.getImagenes);

// GET /api/v1/public/imagenes/:id
router.get('/:id', controller.getImagenById);

module.exports = router;