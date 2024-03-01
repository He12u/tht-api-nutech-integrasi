"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init(
    {
      banner_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "banner_name required!" },
          notEmpty: { msg: "banner_name required!" },
        },
      },
      banner_image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "banner_image required!" },
          notEmpty: { msg: "banner_image required!" },
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
    },
    {
      sequelize,
      modelName: "Banner",
    }
  );
  return Banner;
};
