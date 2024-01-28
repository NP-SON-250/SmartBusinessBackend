"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sales extends Model {
    static associate(models) {
      Sales.belongsTo(models.SupplyOrders, {
        foreignKey: "orderId",
      });
      Sales.belongsTo(models.PurchaseOrders, {
        foreignKey: "orderId",
      });
    }
  }
  Sales.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Sales",
    }
  );
  return Sales;
};
