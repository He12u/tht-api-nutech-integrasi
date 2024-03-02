const { Banner } = require("../models");
const { Service } = require("../models");

class informationController {
  static async getBanner(req, res, next) {
    try {
      const banners = await Banner.findAll({
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: banners,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getServices(req, res, next) {
    try {
      const services = await Service.findAll({
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }
  // end information controller
}

module.exports = informationController;
