const { CustomError } = require("../middlewares/Errorhandler");
const { ObjectId } = require("mongodb");
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

  static async getById(req, res, next) {
    try {
      const { _id } = req.params;

      const userId = new ObjectId(_id);
      const user = await User.findOne({ _id: userId });

      console.log("skibidi");
      console.log(user);
      console.log("toilet");
      console.log("sender: ", _id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const user = await User.findAll();

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateById(req, res, next) {
    try {
      const { _id } = req.params;
      const { firstName, lastName, email, displayName, major, yearOfEntry } = req.body;
      const { _id: UserId } = res.locals.user;

      if (_id !== UserId) {
        throw new CustomError(403, "Unauthorized");
      }

      await User.updateById(_id, { $set: { firstName, lastName, email, displayName, major, yearOfEntry } });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async getMyRequests(req, res, next) {
    try {
      const UserId = res.locals.user._id;
      const user = await User.findOne({ _id: new ObjectId(UserId) }, { friendrequests: 1 });
      if (!user) {
        throw new CustomError(404, "User not found");
      }
      res.status(200).json(user.friendrequests);
    } catch (error) {
      next(error);
    }
  }

  static async addFriend(req, res, next) {
    try {
      const { friendId, chatId, displayName, lastName, major } = req.body;
      const { _id: userId } = res.locals.user;

      if (!friendId) {
        throw new CustomError(400, "Friend ID is required");
      }

      const result = await User.addFriend(userId, friendId, chatId, displayName, lastName, major);

      if (result.modifiedCount === 0) {
        throw new CustomError(404, "User or Friend not found or already added");
      }

      res.status(200).json({ message: "Friend successfully added" });
    } catch (error) {
      next(error);
    }
  }

  static async addBackFriend(req, res, next) {
    try {
      const { friendId, ownId, chatId, displayName, lastName, major } = req.body;

      if (!friendId) {
        throw new CustomError(400, "Friend ID is required");
      }

      const result = await User.addFriend(friendId, ownId, chatId, displayName, lastName, major);

      res.status(200).json({ message: "Friend successfully added" });
    } catch (error) {
      next(error);
    }
  }

  static async removeFriend(req, res, next) {
    try {
      const { friendId, chatId } = req.body;
      const { _id: userId } = res.locals.user;

      if (!friendId) {
        throw new CustomError(400, "Friend ID is required");
      }

      const result = await User.removeFriend(userId, friendId, chatId);

      if (result.modifiedCount === 0) {
        throw new CustomError(404, "User or Friend not found");
      }

      res.status(200).json({ message: "Friend successfully removed" });
    } catch (error) {
      next(error);
    }
  }

  static async addFriendRequest(req, res, next) {
    try {
      const { recipientId } = req.body;
      const { _id: userId } = res.locals.user;

      if (!recipientId) {
        throw new CustomError(400, "Recipient ID is required");
      }

      const result = await User.addFriendRequest(recipientId, userId);

      if (result.modifiedCount === 0) {
        throw new CustomError(404, "User or Recipient not found or request already sent");
      }

      res.status(200).json({ message: "Friend request successfully sent" });
    } catch (error) {
      next(error);
    }
  }

  static async removeFriendRequest(req, res, next) {
    try {
      const { requesterId } = req.body;
      const { _id: userId } = res.locals.user;

      if (!requesterId) {
        throw new CustomError(400, "Requester ID is required");
      }

      const result = await User.removeFriendRequest(userId, requesterId);

      if (result.modifiedCount === 0) {
        throw new CustomError(404, "User or Requester not found");
      }

      res.status(200).json({ message: "Friend request successfully removed" });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ProfileController;
