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

    req.user = {
      email: findUser.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
