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
      Transaction.hasOne(models.Service, { foreignKey: "serviceId" });
    }
  }
  Transaction.init(
    {
      invoice_number: DataTypes.STRING,
      transaction_type: DataTypes.STRING,
      description: DataTypes.STRING,
      total_amount: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
