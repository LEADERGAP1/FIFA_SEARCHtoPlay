const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlayerModel = require('./player');
const SkillModel = require('./skill');

const Player = PlayerModel(sequelize, DataTypes);
const Skill = SkillModel(sequelize, DataTypes);

// Definir relaciones
Player.hasOne(Skill, { foreignKey: 'playerId', onDelete: 'CASCADE' });
Skill.belongsTo(Player, { foreignKey: 'playerId' });

module.exports = {
  Player,
  Skill
};

