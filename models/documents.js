'use strict';
module.exports = function(sequelize, DataTypes) {
  var Documents = sequelize.define('Documents', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: DataTypes.STRING,
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Documents.hasOne(models.Users);
      }
    }
  });
  return Documents;
};
