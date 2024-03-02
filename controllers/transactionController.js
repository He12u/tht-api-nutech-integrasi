const { User } = require("../models");
const { Balance } = require("../models");

class transactionController {
  static async getBalance(req, res, next) {
    try {
      const { email } = req.user;

      const findUser = await User.findOne({
        where: {
          email,
        },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      const findBalance = await Balance.findOne({
        where: {
          userId: findUser.id,
        },
        attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] },
      });

      if (!findBalance) {
        console.log("jalan IF");
        let createBalance = await Balance.create({
          userId: findUser.id,
        });

        res.status(200).json({
          status: 0,
          message: "Get Balance Berhasil",
          data: { balance: createBalance.balance },
        });
      } else {
        console.log("jalan ELSE");
        res.status(200).json({
          status: 0,
          message: "Get Balance Berhasil",
          data: findBalance,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  // end transaction controller
}

module.exports = transactionController;
