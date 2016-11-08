'use strict';
module.exports = function(sequelize, DataTypes) {
  var Roles = sequelize.define('Roles', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  return Roles;
};
