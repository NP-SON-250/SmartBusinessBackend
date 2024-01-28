'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    
    static associate(models) {
      Users.hasMany(models.Businesses, {
        foreignKey: 'userId',
      });
      Users.hasMany(models.PurchaseOrders, {
        foreignKey: "buyerId",
      });
    }
  }
  Users.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile: DataTypes.STRING,
    role: {
      type: Sequelize.ENUM("buyer", "admin","seller","supplier"),
      defaultValue: "buyer",
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};