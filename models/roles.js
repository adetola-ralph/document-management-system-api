module.exports = function(sequelize, DataTypes) {
  const Roles = sequelize.define('Roles', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Roles.hasMany(models.Users, {
          foreignKey: 'roleId'
        });
      }
    }
  });
  return Roles;
};
