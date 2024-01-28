"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SupplyOrders extends Model {
    static associate(models) {
      SupplyOrders.belongsTo(models.Stocks, {
        foreignKey: "stockId",
        as: "orderedFrom",
      });
      SupplyOrders.belongsTo(models.Businesses, {
        foreignKey: "businessId",
        as: "orderedBy",
      });

      SupplyOrders.hasMany(models.Sales, {
        foreignKey: "orderId",
      });
      SupplyOrders.hasMany(models.Payments, {
        foreignKey: "orderId",
      });
    }
  }
  SupplyOrders.init(
    {
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: DataTypes.FLOAT,
      amount: DataTypes.FLOAT,
      location: DataTypes.STRING,
      phone: DataTypes.STRING,
      status: {
        type: Sequelize.ENUM("sent", "confirmed", "delivered"),
        defaultValue: "sent",
        allowNull: false,
      },
      deliveredDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SupplyOrders",
    }
  );
  return SupplyOrders;
};
