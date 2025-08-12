const express = require('express');
const router = express.Router();

// Importar los controladores
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  exportPlayersCSV
} = require('../controllers/playerController');

/**
 * @openapi
 * /players:
 *   get:
 *     summary: Lista jugadores con filtros y paginación
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: club
 *         schema:
 *           type: string
 *         description: Filtrar por club
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filtrar por posición
 *       - in: query
 *         name: version
 *         schema:
 *           type: string
 *         description: Filtrar por versión FIFA
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página (por defecto 1)
 *     responses:
 *       200:
 *         description: Lista de jugadores
 *       401:
 *         description: No autorizado
 */
router.get('/players', getAllPlayers);

/**
 * @openapi
 * /players/export:
 *   get:
 *     summary: Exporta la lista de jugadores a CSV
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo CSV con los jugadores
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/players/export', exportPlayersCSV);

/**
 * @openapi
 * /players/{id}:
 *   get:
 *     summary: Obtiene el detalle de un jugador por ID
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jugador
 *     responses:
 *       200:
 *         description: Detalle del jugador
 *       404:
 *         description: Jugador no encontrado
 */
router.get('/players/:id', getPlayerById);

/**
 * @openapi
 * /players:
 *   post:
 *     summary: Crea un nuevo jugador
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       201:
 *         description: Jugador creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/players', createPlayer);

/**
 * @openapi
 * /players/{id}:
 *   put:
 *     summary: Edita un jugador existente
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jugador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: Jugador actualizado
 *       404:
 *         description: Jugador no encontrado
 */
router.put('/players/:id', updatePlayer);

/**
 * @openapi
 * /players/{id}:
 *   delete:
 *     summary: Elimina un jugador
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jugador
 *     responses:
 *       204:
 *         description: Jugador eliminado
 *       404:
 *         description: Jugador no encontrado
 */
router.delete('/players/:id', deletePlayer);

module.exports = router;

