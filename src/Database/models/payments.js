"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payments.belongsTo(models.SupplyOrders, {
        foreignKey: "orderId",
      });
      Payments.belongsTo(models.PurchaseOrders, {
        foreignKey: "orderId",
      });
    }
  }
  Payments.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: DataTypes.FLOAT,
      status: {
        type: Sequelize.ENUM("full", "half", "NotAtAll"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Payments",
    }
  );
  return Payments;
};
