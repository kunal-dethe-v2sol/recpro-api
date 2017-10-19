/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
};
