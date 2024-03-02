const { comparePassword } = require("../helpers/bcryptjs");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models");
const cloudinary = require("cloudinary");
const uuid = require("crypto").randomUUID();
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

class membershipController {
  static async registration(req, res, next) {
    try {
      let { email, first_name, last_name, password } = req.body;
      if (!email) {
        throw { name: "email required!" };
      } else if (!first_name) {
        throw { name: "first_name required!" };
      } else if (!last_name) {
        throw { name: "last_name required!" };
      } else if (!password) {
        throw { name: "password required!" };
      }

      await User.create({
        email,
        first_name,
        last_name,
        password,
      });

      res.status(200).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "email required!" };
      } else if (!password) {
        throw { name: "password required!" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        throw { name: "Invalid email format!" };
      }

      const findUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw { name: "Unauthorized" };
      }

      const validatePassword = comparePassword(password, findUser.password);

      if (!validatePassword) {
        throw { name: "Unauthorized" };
      }

      const access_token = createToken({
        email: findUser.email,
        expiration: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
      });

      res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: {
          token: access_token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const { email } = req.user;
      const findUser = await User.findOne({
        where: {
          email,
        },
        attributes: { exclude: ["id", "password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {
          email: findUser.email,
          first_name: findUser.first_name,
          last_name: findUser.last_name,
          profile_image: findUser.profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async profileUpdate(req, res, next) {
    try {
      const { email } = req.user;
      const { first_name, last_name } = req.body;

      if (!first_name) {
        throw { name: "first_name required!" };
      }

      if (!last_name) {
        throw { name: "last_name required!" };
      }

      let findUpdate = await User.update(
        { first_name, last_name },
        {
          where: {
            email,
          },
          returning: true,
        }
      );

      res.status(200).json({
        status: 0,
        message: "Update Pofile berhasil",
        data: {
          email: findUpdate[1][0].email,
          first_name: findUpdate[1][0].first_name,
          last_name: findUpdate[1][0].last_name,
          profile_image: findUpdate[1][0].profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async profileImage(req, res, next) {
    try {
      // console.log(req.file, "<<<<<<<<<<< INI REQ FILE");
      const { email } = req.user;

      if (!req.file) {
        throw { name: "profile_image required!" };
      }

      if (
        req.file.mimetype !== "image/jpeg" &&
        req.file.mimetype !== "image/png"
      ) {
        throw { name: "Invalid file format!" };
      }

      const imgBase64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${imgBase64}`;
      const result = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "tht",
        public_id: `${req.file.originalname}-${uuid}`,
      });

      const findUpdate = await User.update(
        { profile_image: result.secure_url },
        {
          where: {
            email,
          },
          returning: true,
        }
      );

      res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
          email: findUpdate[1][0].email,
          first_name: findUpdate[1][0].first_name,
          last_name: findUpdate[1][0].last_name,
          profile_image: findUpdate[1][0].profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  // end membership controller
}

module.exports = membershipController;
