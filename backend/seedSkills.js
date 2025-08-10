require('dotenv').config();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { DataTypes, Op } = require('sequelize');
const sequelize = require('./config/database');

// Modelos
const PlayerModel = require('./models/player');
const SkillModel  = require('./models/skill');

const Player = PlayerModel(sequelize, DataTypes);
const Skill  = SkillModel(sequelize, DataTypes);

// Relación 1:1
Player.hasOne(Skill, { foreignKey: 'playerId', onDelete: 'CASCADE' });
Skill.belongsTo(Player, { foreignKey: 'playerId' });

const CSV_PATH = path.join(__dirname, 'data', 'male_players.csv');
const BATCH_SIZE = 1000;

async function run() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conectado a MySQL');
    await sequelize.sync({ alter: true });

    const rows = [];

    console.log('📥 Leyendo CSV:', CSV_PATH);
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    let total = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const slice = rows.slice(i, i + BATCH_SIZE);

      await sequelize.transaction(async (t) => {
        for (const r of slice) {
          const match = await Player.findOne({
            where: {
              short_name: r.short_name,
              fifa_version: r.fifa_version,
              fifa_update_date: r.fifa_update_date ? r.fifa_update_date.split(' ')[0] : null
            },
            transaction: t
          });

          if (!match) {
            console.warn(`⚠️ No se encontró player: ${r.short_name} - ${r.fifa_version}`);
            continue;
          }

          await Skill.create({
            playerId:   match.id,
            pace:       r.pace       ? parseInt(r.pace, 10)       : null,
            shooting:   r.shooting   ? parseInt(r.shooting, 10)   : null,
            passing:    r.passing    ? parseInt(r.passing, 10)    : null,
            dribbling:  r.dribbling  ? parseInt(r.dribbling, 10)  : null,
            defending:  r.defending  ? parseInt(r.defending, 10)  : null,
            physic:     r.physic     ? parseInt(r.physic, 10)     : null
          }, { transaction: t });
        }
      });

      total += slice.length;
      console.log(`✅ Insertados ${total}/${rows.length}`);
    }

    console.log(`🎉 SeedSkills completado. Total insertados: ${total}`);
    await sequelize.close();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seedSkills:', error);
    process.exit(1);
  }
}

run();

