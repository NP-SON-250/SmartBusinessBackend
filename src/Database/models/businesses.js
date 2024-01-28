"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Businesses extends Model {
    static associate(models) {
      Businesses.belongsTo(models.Users, {
        foreignKey: "userId",
				as: "businessOwner"
      });
      Businesses.hasMany(models.Stocks, {
        foreignKey: "businessId",
      });
      Businesses.hasMany(models.SupplyOrders, {
        foreignKey: "businessId",
      });
    }
  }
  Businesses.init(
    {
      name: DataTypes.STRING,
      type: {
        type: Sequelize.ENUM("singleSeller", "multiSeller"),
        allowNull: false,
      },
      description: DataTypes.TEXT('long'),
      profile: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Businesses",
    }
  );
  return Businesses;
};
