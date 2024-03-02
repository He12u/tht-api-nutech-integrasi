const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw { name: "Token Unauthorized" };
    }

    bearerToken = bearerToken.split(" ")[1];

    const verified = verifyToken(bearerToken);

    const findUser = await User.findOne({
      where: {
        email: verified.email,
      },
    });

    if (!findUser) {
      throw { name: "Token Unauthorized" };
    }

    if (Math.floor(Date.now() / 1000) <= verified.expiration) {
      req.user = {
        email: findUser.email,
      };

      next();
    } else {
      throw { name: "Token Unauthorized" };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
