const { ObjectId } = require("bson");
const User = require("../models/User");
const { getToken } = require("../helpers/jwt");
const { getHashedString, isStringRelevant } = require("../helpers/bcrypt");
const { CustomError } = require("../middlewares/Errorhandler");

class AuthController {
  static async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser || !isStringRelevant(password, existingUser.password)) {
        throw new CustomError(403, "Wrong email or password");
      }

      res.status(200).json({
        token: getToken(existingUser),
        user: { email, displayName: existingUser.displayName, role: existingUser.role, _id: existingUser._id },
      });
    } catch (error) {
      next(error);
    }
  }

  static async signUp(req, res, next) {
    try {
      const { email, password, displayName, role } = req.body;

      const existedUser = await User.findOne({ email });
      if (existedUser) throw new CustomError(400, "email is taken");

      const { insertedId } = await User.create({ email, password: getHashedString(password), displayName, role });
      const existingUser = await User.findOne({ _id: new ObjectId(insertedId) });

      res.status(201).json({ token: getToken(existingUser), user: { email, displayName, role, _id: existingUser._id } });
    } catch (error) {
      next(error);
    }
  }

  static async userInfo(req, res, next) {
    try {
      res.status(200).json(res.locals.user);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AuthController;
