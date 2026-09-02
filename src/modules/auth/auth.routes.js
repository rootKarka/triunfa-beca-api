const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('./auth.controller');
const validate = require('../../shared/middlewares/validate.middleware');

const router = Router();

const loginValidation = [
  body('correo').isEmail().withMessage('Correo electrónico inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  validate,
];

// POST /api/v1/admin/auth/login
router.post('/login', loginValidation, controller.login);

module.exports = router;