require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes    = require('./routes/authRoutes');
const privateRoutes = require('./routes/privateRoutes');
const playerRoutes  = require('./routes/playerRoutes');
const sequelize     = require('./config/database');

// Swagger (CommonJS)
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Sequelize + modelos
const { DataTypes } = require('sequelize');
const PlayerModel = require('./models/player');
const SkillModel  = require('./models/skill');

// Inicializar modelos
const Player = PlayerModel(sequelize, DataTypes);
const Skill  = SkillModel(sequelize, DataTypes);

// Relaciones
Player.hasOne(Skill, { foreignKey: 'playerId', onDelete: 'CASCADE' });
Skill.belongsTo(Player, { foreignKey: 'playerId' });

app.use(cors());
app.use(express.json());

// Healthchecks
app.get('/health',     (_req, res) => res.json({ ok: true })); // directo
app.get('/api/health', (_req, res) => res.json({ ok: true })); // vía Nginx

// Swagger (servidor relativo para que funcione detrás de /api)
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'FIFA SearchToPlay API',
      version: '1.0.0',
      description: 'Documentación de la API (Players, Auth, Export CSV)',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Player: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            short_name: { type: 'string' },
            long_name: { type: 'string' },
            age: { type: 'integer' },
            club_name: { type: 'string' },
            club_position: { type: 'string' },
            fifa_version: { type: 'string' },
            nationality_name: { type: 'string' },
            fifa_update_date: { type: 'string', format: 'date' },
          },
          required: ['short_name', 'age', 'nationality_name', 'fifa_update_date'],
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api',      privateRoutes);
app.use('/api',      playerRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conectado a MySQL');

    await sequelize.sync({ alter: true });
    console.log('🗄️ Tablas sincronizadas');

    // Seed mínimo (idempotente) — incluye los campos requeridos
    try {
      const count = await Player.count();
      if (count === 0) {
        await Player.bulkCreate([
          {
            short_name: 'L. Messi',
            long_name: 'Lionel Messi',
            age: 37,
            nationality_name: 'Argentina',
            club_name: 'Inter Miami',
            club_position: 'RW',
            fifa_version: '25',
            fifa_update_date: '2024-09-15'
          },
          {
            short_name: 'K. De Bruyne',
            long_name: 'Kevin De Bruyne',
            age: 33,
            nationality_name: 'Belgium',
            club_name: 'Manchester City',
            club_position: 'CM',
            fifa_version: '25',
            fifa_update_date: '2024-09-15'
          },
          {
            short_name: 'E. Haaland',
            long_name: 'Erling Haaland',
            age: 24,
            nationality_name: 'Norway',
            club_name: 'Manchester City',
            club_position: 'ST',
            fifa_version: '25',
            fifa_update_date: '2024-09-15'
          }
        ]);
        console.log('🌱 Seed inicial insertado');
      }
    } catch (e) {
      console.error('Seed falló (continuo igual):', e.message);
    }
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
  } finally {
    // Escuchar SIEMPRE
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend: http://localhost:${PORT}`);
      console.log(`📚 Swagger: http://localhost:${PORT}/api/docs  (vía proxy: http://localhost:8080/api/docs)`);
    });
  }
}

startServer();

