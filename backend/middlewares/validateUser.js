const { check, validationResult } = require('express-validator');

const validateRegister = [
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('email', 'Debe ser un email válido').isEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  check('email', 'Debe ser un email válido').isEmail(),
  check('password', 'La contraseña es obligatoria').notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegister, validateLogin };

