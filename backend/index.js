require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const privateRoutes = require('./routes/privateRoutes');
const playerRoutes = require('./routes/playerRoutes'); // ✅ NUEVA LÍNEA
const sequelize = require('./config/database');
const cors = require('cors');

// Importar Sequelize y modelos
const { DataTypes } = require('sequelize');
const PlayerModel = require('./models/player');
const SkillModel = require('./models/skill');

// Inicializar modelos
const Player = PlayerModel(sequelize, DataTypes);
const Skill = SkillModel(sequelize, DataTypes);

// Definir relaciones
Player.hasOne(Skill, { foreignKey: 'playerId', onDelete: 'CASCADE' });
Skill.belongsTo(Player, { foreignKey: 'playerId' });

app.use(cors()); // 👈 Esto habilita CORS

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', privateRoutes);
app.use('/api', playerRoutes); // ✅ NUEVA LÍNEA


// Puerto
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conectado a MySQL');

    // Sincronizar tablas y relaciones
    await sequelize.sync({ alter: true });
    console.log('🗄️ Tablas sincronizadas');

    // Levantar servidor
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al conectar:', error);
  }
}

startServer();

