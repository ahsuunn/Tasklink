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
        user: {
          username: existingUser.username,
          displayName: existingUser.displayName,
          role: existingUser.role,
          _id: existingUser._id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async signUp(req, res, next) {
    try {
      const { email, password, displayName, lastName, major, yearOfEntry, role } = req.body;

      // Validate required fields
      if (!email || !password || !displayName || !role) {
        throw new CustomError(400, "Missing required fields");
      }

      // Check if the email already exists
      const existedUser = await User.findOne({ email });
      if (existedUser) throw new CustomError(400, "Email is taken");

      // Create a new user
      const { insertedId } = await User.create({
        email,
        password: getHashedString(password),
        displayName,
        lastName,
        major,
        yearOfEntry,
        role,
        friends: [],
        friendrequests: [],
      });

      const existingUser = await User.findOne({ _id: new ObjectId(insertedId) });

      res.status(201).json({
        token: getToken(existingUser),
        user: {
          email,
          displayName,
          lastName,
          major,
          yearOfEntry,
          role,
          _id: existingUser._id,
        },
      });
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

  static async verifyPassword(req, res, next) {
    try {
      const _id = res.locals.user._id;
      console.log(_id);
      console.log("cheese");

      const user = await User.findOne({ _id: new ObjectId(_id) });

      console.log(user);
      if (!user) {
        console.log("boom");
        throw new CustomError(404, "User not found");
      }

      const storedPassword = user.password;

      const { inputtedPassword } = req.body;

      console.log("Inputted Password: ", inputtedPassword);
      console.log("storedPassword: ", storedPassword);

      const isPasswordValid = isStringRelevant(inputtedPassword, storedPassword);

      if (!isPasswordValid) {
        return res.status(403).json({ success: false, message: "Incorrect password" });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
