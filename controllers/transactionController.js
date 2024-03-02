const { User } = require("../models");
const { Balance } = require("../models");
const { Transaction } = require("../models");
const { Service } = require("../models");
const crypto = require("crypto");

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
        let createBalance = await Balance.create({
          userId: findUser.id,
        });

        res.status(200).json({
          status: 0,
          message: "Get Balance Berhasil",
          data: { balance: createBalance.balance },
        });
      } else {
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

  static async topup(req, res, next) {
    try {
      const { email } = req.user;
      const { top_up_amount } = req.body;

      const isValidAmount =
        !isNaN(top_up_amount) && parseInt(top_up_amount) >= 0;

      if (isValidAmount) {
        const findUser = await User.findOne({
          where: {
            email,
          },
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        });

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = String(currentDate.getFullYear());

        const invoice_number = `INV${day}${month}${year}-${crypto
          .randomUUID()
          .split("-")
          .join("")}`;
        const transaction_type = "TOPUP";
        const description = "Top Up balance";
        const total_amount = top_up_amount;

        const findBalance = await Balance.findOne({
          where: {
            userId: findUser.id,
          },
          attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] },
        });

        if (!findBalance) {
          let createBalance = await Balance.create({
            userId: findUser.id,
          });

          let findUpdate = await Balance.update(
            { balance: Number(top_up_amount) },
            {
              where: {
                userId: findUser.id,
              },
              returning: true,
            }
          );

          await Transaction.create({
            invoice_number,
            transaction_type,
            description,
            total_amount,
            userId: findUser.id,
          });

          res.status(200).json({
            status: 0,
            message: "Top Up Balance berhasil",
            data: {
              balance: findUpdate[1][0].balance,
            },
          });
        } else {
          let findUpdate = await Balance.update(
            { balance: Number(findBalance.balance) + Number(top_up_amount) },
            {
              where: {
                userId: findUser.id,
              },
              returning: true,
            }
          );

          await Transaction.create({
            invoice_number,
            transaction_type,
            description,
            total_amount,
            userId: findUser.id,
          });

          res.status(200).json({
            status: 0,
            message: "Top Up Balance berhasil",
            data: {
              balance: findUpdate[1][0].balance,
            },
          });
        }
      } else {
        throw { name: "Invalid top_up_amount!" };
      }
    } catch (error) {
      next(error);
    }
  }

  static async transaction(req, res, next) {
    try {
      const { email } = req.user;
      const { service_code } = req.body;

      const findService = await Service.findOne({
        where: {
          service_code,
        },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });

      if (!findService) {
        throw { name: "Invalid service_code!" };
      }

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
        throw { name: "Minumum balance!" };
      }

      if (Number(findBalance.balance) < Number(findService.service_tariff)) {
        throw { name: "Minumum balance!" };
      }

      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = String(currentDate.getFullYear());

      const invoice_number = `INV${day}${month}${year}-${crypto
        .randomUUID()
        .split("-")
        .join("")}`;
      const transaction_type = "PAYMENT";
      const description = findService.service_name;
      const total_amount = findService.service_tariff;

      await Balance.update(
        { balance: Number(findBalance.balance) - Number(total_amount) },
        {
          where: {
            userId: findUser.id,
          },
          returning: true,
        }
      );

      const createTransaction = await Transaction.create({
        invoice_number,
        transaction_type,
        description,
        total_amount,
        userId: findUser.id,
      });

      res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
          invoice_number,
          service_code: findService.service_code,
          service_name: findService.service_name,
          transaction_type,
          total_amount,
          created_on: createTransaction.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      const { email } = req.user;
      let { offset, limit } = req.query;

      let queryOption = {};

      queryOption.order = [["createdAt", "DESC"]];
      if (limit) {
        queryOption.limit = limit;
        queryOption.offset = offset;
      }

      const { count, rows } = await Transaction.findAndCountAll(queryOption);
      const data = {
        offset,
        limit: limit,
        records: rows,
      };

      res.status(200).json({
        status: 0,
        message: "Get History Berhasil",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
  // end transaction controller
}

module.exports = transactionController;
