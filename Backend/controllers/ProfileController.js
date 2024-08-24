const { CustomError } = require("../middlewares/Errorhandler");
const User = require("../models/User");

class ProfileController {
  static async getByEmail(req, res, next) {
    try {
      const { email } = req.params;

      const user = await User.findOne({ email });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateById(req, res, next) {
    try {
      const { _id } = req.params;
      const { profilePicUrl, displayName } = req.body;
      const { _id: UserId } = res.locals.user;

      if (_id !== UserId) {
        throw new CustomError(403, "Unauthorized");
      }

      await User.updateById(_id, { $set: { profilePicUrl, displayName } });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ProfileController;
