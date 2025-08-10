
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validateUser'); // 👈 nueva línea

router.post('/register', validateRegister, register); // 👈 con validación
router.post('/login', validateLogin, login);         // 👈 con validación

module.exports = router;

