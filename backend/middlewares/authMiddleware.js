const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El token debería venir así: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guarda info del usuario en la request
    next(); // Continúa con la siguiente función
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;

