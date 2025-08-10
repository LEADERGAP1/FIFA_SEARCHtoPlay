const express = require('express');
const router = express.Router();

// Importar los controladores
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  exportPlayersCSV // ✅ ¡Agregado para exportar!
} = require('../controllers/playerController');

// ✅ Ruta para obtener todos los jugadores (con filtros y paginación)
router.get('/players', getAllPlayers);

// ✅ Ruta para obtener un jugador específico por ID
router.get('/players/:id', getPlayerById);

// ✅ Ruta para crear un nuevo jugador con sus habilidades
router.post('/players', createPlayer);

// ✅ Ruta para editar un jugador existente
router.put('/players/:id', updatePlayer);

// ✅ Ruta para eliminar un jugador
router.delete('/players/:id', deletePlayer);

// ✅ Ruta para exportar jugadores a CSV con filtros
router.get('/players/export', exportPlayersCSV); // 🆕 ← Esta es la nueva ruta

module.exports = router;

