// models/skill.js
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    pace: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shooting: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    passing: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dribbling: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    defending: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    physic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'skills'
  });

  return Skill;
};



