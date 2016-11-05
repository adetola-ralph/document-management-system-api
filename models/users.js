'use strict';
const bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false ,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: (value) => {
        if(!value) return '';
        return bcrypt.hashSync(value, 10);
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.Documents, {
          onDelete: 'cascade'
        });
        Users.hasOne(models.Roles);
      }
    }
  });
  return Users;
};
