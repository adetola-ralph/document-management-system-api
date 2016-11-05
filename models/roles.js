'use strict';
module.exports = function(sequelize, DataTypes) {
  var Roles = sequelize.define('Roles', {
    title: DataTypes.STRING
  });
  return Roles;
};
