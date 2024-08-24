const { ObjectId } = require("mongodb");
const { getPayload } = require("../helpers/jwt");
const User = require("../models/User");
const { JsonWebTokenError } = require("jsonwebtoken");
const { CustomError } = require("./Errorhandler");

const Authentication = async (req, res, next) => {
  try {
    const accessToken = req.headers.access_token;
    if (!accessToken) throw new CustomError(403, "Please re-login");

    const payload = getPayload(accessToken);
    if (!payload) throw new CustomError(403, "Please re-login");

    const { _id, email, password, displayName, role } = payload;
    if (!_id || !email || !password || !role) throw new CustomError(403, "Please re-login");

    const existingUser = await User.findOne({ _id: new ObjectId(_id), email });

    if (!existingUser || password !== existingUser.password) {
      throw new CustomError(403, "Please re-login");
    }

    res.locals.user = { _id, email, displayName, role };
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      error = new CustomError(403, "Please re-login");
    }
    next(error);
  }
};

module.exports = Authentication;
