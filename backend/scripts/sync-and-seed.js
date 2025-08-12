// backend/scripts/sync-and-seed.js
require('dotenv').config();

// Ajustá esta línea si tu index de modelos está en otra ruta.
// Lo normal es que sea backend/models/index.js
const models = require('../models');
const { sequelize } = models;

// Trata de tomar Player si existe. Si no, igual sincroniza tablas.
const Player = models.Player || models.player;

async function run() {
  try {
    console.log('Conectando a DB...');
    await sequelize.authenticate();
    console.log('✅ DB conectada');

    // Crea/actualiza tablas. En el primer arranque, si querés forzar recreación, usá { force: true }.
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');

    if (Player) {
      const count = await Player.count();
      if (count === 0) {
        await Player.bulkCreate([
          { short_name: 'L. Messi', club_name: 'Inter Miami', club_position: 'RW', version: 'Gold' },
          { short_name: 'K. De Bruyne', club_name: 'Man City', club_position: 'CM', version: 'Gold' },
          { short_name: 'E. Haaland', club_name: 'Man City', club_position: 'ST', version: 'Gold' },
        ]);
        console.log('✅ Seed de Players insertado');
      } else {
        console.log(`Players ya tenía ${count} filas, no seedeo`);
      }
    } else {
      console.log('⚠️ No encontré el modelo Player exportado en models/index.js (igual tablas sync OK).');
    }

    console.log('🎉 Sync & seed DONE');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error en sync/seed:', e);
    process.exit(1);
  }
}

run();

