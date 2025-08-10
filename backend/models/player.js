// models/player.js

module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    short_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    long_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nationality_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    club_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    club_position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fifa_version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fifa_update_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'players',
    timestamps: false
  });

  return Player;
};

