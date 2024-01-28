"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stocks extends Model {
    
    static associate(models) {
      Stocks.hasMany(models.PurchaseOrders, {
        foreignKey: "stockId",
      });
      Stocks.hasMany(models.SupplyOrders, {
        foreignKey: "stockId",
      });
      Stocks.belongsTo(models.Businesses, {
        foreignKey: "businessId",
				as: "stockOwner"
      });
    }
  }
  Stocks.init(
    {
      name: DataTypes.STRING,
      profile: DataTypes.STRING,
      category: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      unitCost: DataTypes.FLOAT,
      total: DataTypes.FLOAT,
      salePrice: DataTypes.FLOAT,
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Stocks",
    }
  );
  return Stocks;
};
