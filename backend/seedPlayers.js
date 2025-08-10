require('dotenv').config();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { DataTypes } = require('sequelize');
const sequelize = require('./config/database');
const PlayerModel = require('./models/player');

const Player = PlayerModel(sequelize, DataTypes);

// Ajustá el path si pusiste el CSV en otro lado
const CSV_PATH = path.join(__dirname, 'data/male_players.csv');

// Para no cargar miles de filas en memoria si el CSV es grande
const BATCH_SIZE = 161584;

async function run() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conectado a MySQL');

    await sequelize.sync({ alter: true });
    console.log('🗄️ Tablas sincronizadas');

    const buffer = [];
    let total = 0;

    console.log('📥 Leyendo CSV:', CSV_PATH);

    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on('data', (row) => {
          // Mapeá solo las columnas que definiste en el modelo
          // Ajustá los nombres si en tu CSV difieren
          const player = {
            short_name: row.short_name,
            long_name: row.long_name,
            age: parseInt(row.age, 10) || null,
            nationality_name: row.nationality_name,
            club_name: row.club_name || null,
            club_position: row.club_position || row.player_positions || null,
            fifa_version: row.fifa_version || row.fifa_version_short || row.fifa_year || null,
            fifa_update_date: row.fifa_update_date || null
          };

          buffer.push(player);

          if (buffer.length === BATCH_SIZE) {
          // insert por lotes
            this.pause?.(); // (csv-parser v3 usa this.pause(); en v2 no hace falta)
            Player.bulkCreate(buffer, { validate: true })
              .then(() => {
                total += buffer.length;
                console.log(`✅ Insertados ${total} jugadores...`);
                buffer.length = 0;
                this.resume?.();
              })
              .catch((err) => {
                console.error('❌ Error en bulkCreate:', err);
                reject(err);
              });
          }
        })
        .on('end', async () => {
          try {
            if (buffer.length) {
              await Player.bulkCreate(buffer, { validate: true });
              total += buffer.length;
            }
            console.log(`🎉 Seed completado. Jugadores insertados: ${total}`);
            resolve();
          } catch (err) {
            console.error('❌ Error al insertar el último batch:', err);
            reject(err);
          }
        })
        .on('error', reject);
    });

    await sequelize.close();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
}

run();


