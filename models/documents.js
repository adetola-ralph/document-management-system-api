module.exports = function (sequelize, DataTypes) {
  const Documents = sequelize.define('Documents', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: DataTypes.STRING,
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerRoleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Documents.belongsTo(models.Users, {
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
