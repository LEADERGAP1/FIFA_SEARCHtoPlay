const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const { Player, Skill } = require('../models');

const getAllPlayers = async (req, res) => {
  const {
    name,
    club,
    position,
    version,
    page = 1,
    limit = 20
  } = req.query;

  const where = {};

  if (name) {
    where[Op.or] = [
      { short_name: { [Op.like]: `%${name}%` } },
      { long_name: { [Op.like]: `%${name}%` } }
    ];
  }

  if (club) {
    where.club_name = { [Op.like]: `%${club}%` };
  }

  if (position) {
    where.club_position = { [Op.like]: `%${position}%` };
  }

  if (version) {
    where.fifa_version = { [Op.like]: `%${version}%` };
  }

  const offset = (page - 1) * limit;

  try {
    const players = await Player.findAndCountAll({
      where,
      include: [{ model: Skill }],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: players.count,
      page: parseInt(page),
      pages: Math.ceil(players.count / limit),
      players: players.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener jugadores:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getPlayerById = async (req, res) => {
  const { id } = req.params;

  try {
    const player = await Player.findByPk(id, {
      include: [{ model: Skill }]
    });

    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    res.json(player);
  } catch (error) {
    console.error('❌ Error al obtener jugador:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createPlayer = async (req, res) => {
  const {
    short_name,
    long_name,
    age,
    nationality_name,
    club_name,
    club_position,
    fifa_version,
    fifa_update_date,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physic
  } = req.body;

  try {
    const newPlayer = await Player.create({
      short_name,
      long_name,
      age,
      nationality_name,
      club_name,
      club_position,
      fifa_version,
      fifa_update_date
    });

    const newSkill = await Skill.create({
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physic,
      playerId: newPlayer.id
    });

    res.status(201).json({
      message: 'Jugador creado con éxito',
      player: newPlayer,
      skill: newSkill
    });
  } catch (error) {
    console.error('❌ Error al crear jugador:', error);
    res.status(500).json({ error: 'Error al crear jugador' });
  }
};

const updatePlayer = async (req, res) => {
  const { id } = req.params;
  const {
    short_name,
    long_name,
    age,
    nationality_name,
    club_name,
    club_position,
    fifa_version,
    fifa_update_date,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physic
  } = req.body;

  try {
    const player = await Player.findByPk(id, { include: Skill });

    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    await player.update({
      short_name,
      long_name,
      age,
      nationality_name,
      club_name,
      club_position,
      fifa_version,
      fifa_update_date
    });

    if (player.Skill) {
      await player.Skill.update({ pace, shooting, passing, dribbling, defending, physic });
    } else {
      await Skill.create({
        pace,
        shooting,
        passing,
        dribbling,
        defending,
        physic,
        playerId: player.id
      });
    }

    res.json({ message: 'Jugador actualizado con éxito', player });
  } catch (error) {
    console.error('❌ Error al actualizar jugador:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deletePlayer = async (req, res) => {
  const { id } = req.params;

  try {
    const player = await Player.findByPk(id);

    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    await player.destroy();

    res.json({ message: 'Jugador eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar jugador:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const exportPlayersCSV = async (req, res) => {
  const { name, club, position, version } = req.query;

  const where = {};

  if (name) {
    where[Op.or] = [
      { short_name: { [Op.like]: `%${name}%` } },
      { long_name: { [Op.like]: `%${name}%` } }
    ];
  }

  if (club) {
    where.club_name = { [Op.like]: `%${club}%` };
  }

  if (position) {
    where.club_position = { [Op.like]: `%${position}%` };
  }

  if (version) {
    where.fifa_version = { [Op.like]: `%${version}%` };
  }

  try {
    const players = await Player.findAll({
      where,
      include: [{ model: Skill }]
    });

    const plainData = players.map(p => ({
      id: p.id,
      short_name: p.short_name,
      long_name: p.long_name,
      age: p.age,
      nationality_name: p.nationality_name,
      club_name: p.club_name,
      club_position: p.club_position,
      fifa_version: p.fifa_version,
      fifa_update_date: p.fifa_update_date,
      pace: p.Skill?.pace,
      shooting: p.Skill?.shooting,
      passing: p.Skill?.passing,
      dribbling: p.Skill?.dribbling,
      defending: p.Skill?.defending,
      physic: p.Skill?.physic
    }));

    const parser = new Parser();
    const csv = parser.parse(plainData);

    res.header('Content-Type', 'text/csv');
    res.attachment('jugadores.csv');
    return res.send(csv);
  } catch (error) {
    console.error('❌ Error al exportar CSV:', error);
    res.status(500).json({ error: 'Error al exportar datos' });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  exportPlayersCSV
};

