"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseOrders extends Model {
    static associate(models) {
      PurchaseOrders.belongsTo(models.Stocks, {
        foreignKey: "stockId",
        as: "orderedProduct",
      });
      PurchaseOrders.belongsTo(models.Users, {
        foreignKey: "buyerId",
        as: "businessOrderedIt",
      });
      PurchaseOrders.hasMany(models.Sales, {
        foreignKey: "orderId",
      });
      PurchaseOrders.hasMany(models.Payments, {
        foreignKey: "orderId",
      });
    }
  }
  PurchaseOrders.init(
    {
      buyerId: {
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
      modelName: "PurchaseOrders",
    }
  );
  return PurchaseOrders;
};
