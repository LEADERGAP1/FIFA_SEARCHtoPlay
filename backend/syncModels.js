const sequelize = require('./config/database');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conexión establecida con éxito.');

    await sequelize.sync({ force: false }); // ⚠️ Cambia a true si querés borrar y recrear
    console.log('✅ ¡Modelos sincronizados con la base de datos!');
  } catch (error) {
    console.error('❌ Error al sincronizar los modelos:', error);
  } finally {
    await sequelize.close();
  }
})();

