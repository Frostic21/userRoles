'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role,{
        as: 'role',
        foreignKey: 'role_id'
      })
    }
    can(action){
      let match = this.role.permissions.find(function(permission){
        return permission.name === action
      });

      if(match) return true;
      return false;
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'roles_users',
    timestamps: false
  });
  return User;
};