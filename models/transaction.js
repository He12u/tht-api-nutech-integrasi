"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: "userId" });
      Transaction.belongsTo(models.Service, { foreignKey: "serviceId" });
    }
  }
  Transaction.init(
    {
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "invoice_number required!" },
          notEmpty: { msg: "invoice_number required!" },
        },
      },
      transaction_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "transaction_type required!" },
          notEmpty: { msg: "transaction_type required!" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "description required!" },
          notEmpty: { msg: "description required!" },
        },
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "total_amount required!" },
          notEmpty: { msg: "total_amount required!" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "userId required!" },
          notEmpty: { msg: "userId required!" },
        },
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "serviceId required!" },
          notEmpty: { msg: "serviceId required!" },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
