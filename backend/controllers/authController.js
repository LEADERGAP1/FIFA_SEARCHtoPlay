const bcrypt = require('bcryptjs');        // usás bcryptjs en tu proyecto
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// util: devolver un user sin password
const toSafeUser = (u) => ({ id: u.id, nombre: u.nombre, email: u.email });

const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // verificar duplicado
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ nombre, email, password: hashedPassword });

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: toSafeUser(newUser)
    });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    if (!process.env.JWT_SECRET) {
      console.error('Falta JWT_SECRET en las variables de entorno');
      return res.status(500).json({ error: 'Configuración del servidor inválida' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // respuesta compatible con tu front
    return res.json({
      message: 'Login exitoso',
      token,                 // por si el front esperaba "token"
      access_token: token,   // y también "access_token"
      user: toSafeUser(user) // datos del usuario (sin password)
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };

