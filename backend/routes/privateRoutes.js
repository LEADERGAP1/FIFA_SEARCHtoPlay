const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Ruta protegida accedida con éxito', user: req.user });
});

console.log('🛡️ Rutas privadas cargadas');
module.exports = router;


