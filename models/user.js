"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, { foreignKey: "userId" });
      User.hasOne(models.Balance, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Parameter email harus di isi" },
          notEmpty: { msg: "Parameter email harus di isi" },
          isEmail: { msg: "Parameter email tidak sesuai format" },
        },
        unique: {
          args: true,
          msg: "Email sudah terdaftar",
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Parameter first_name harus di isi" },
          notEmpty: { msg: "Parameter first_name harus di isi" },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Parameter last_name harus di isi" },
          notEmpty: { msg: "Parameter last_name harus di isi" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Parameter password harus di isi" },
          notEmpty: { msg: "Parameter password harus di isi" },
          len: {
            args: [8, Infinity],
            msg: "Password length minimal 8 karakter",
          },
        },
      },
      profile_image: {
        type: DataTypes.STRING,
        defaultValue: "https://minio.nutech-integrasi.app/take-home-test/null",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  });

  return User;
};
