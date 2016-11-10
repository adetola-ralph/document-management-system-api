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
        Documents.belongsTo(models.Users,{
          as: 'owner',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Documents;
};
