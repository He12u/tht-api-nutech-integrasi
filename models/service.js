"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.hasOne(models.Transaction, { foreignKey: "serviceId" });
    }
  }
  Service.init(
    {
      service_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "service_code required!" },
          notEmpty: { msg: "service_code required!" },
        },
      },
      service_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "service_name required!" },
          notEmpty: { msg: "service_name required!" },
        },
      },
      service_icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "service_icon required!" },
          notEmpty: { msg: "service_icon required!" },
        },
      },
      service_tariff: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "service_tariff required!" },
          notEmpty: { msg: "service_tariff required!" },
        },
      },
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
