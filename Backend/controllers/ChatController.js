const { ObjectId } = require("bson");
const Chat = require("../models/Chat");
const { CustomError } = require("../middlewares/Errorhandler");

class ChatsController {
  static async getAllChats(req, res, next) {
    try {
      const data = await Chat.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getUserChats(req, res, next) {
    try {
      const userId = res.locals.user._id;
      const data = await Chat.findAll({
        $or: [{ userone: userId }, { usertwo: userId }],
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getOneChat(req, res, next) {
    try {
      const { _id } = req.params;

      if (!ObjectId.isValid(_id)) {
        throw new CustomError(400, "Invalid Chat ID format!");
      }

      const chat = await Chat.findOne({ _id: new ObjectId(_id) });

      if (!chat) {
        throw new CustomError(404, "Chat Not Found!");
      }

      res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  }

  static async createChat(req, res, next) {
    try {
      const { userone, usertwo, chatcontent = [] } = req.body;

      if (!ObjectId.isValid(userone) || !ObjectId.isValid(usertwo)) {
        throw new CustomError(400, "Invalid User ID format!");
      }

      const result = await Chat.create({
        userone: userone,
        usertwo: usertwo,
        chatcontent,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteChat(req, res, next) {
    try {
      const { _id } = req.params;

      if (!ObjectId.isValid(_id)) {
        throw new CustomError(400, "Invalid Chat ID format!");
      }

      const result = await Chat.deleteById(_id);
      if (result.deletedCount === 0) {
        throw new CustomError(404, "Chat Not Found!");
      }

      res.status(200).json({ message: "Chat successfully deleted." });
    } catch (error) {
      next(error);
    }
  }

  static async addMessageToChat(req, res, next) {
    try {
      const { _id } = req.params;
      const { senderId, content } = req.body;

      const newMessage = {
        _id: new ObjectId(), // Generate a new ObjectId for the message itself
        senderId: new ObjectId(senderId), // Convert senderId to ObjectId
        content,
      };

      const result = await Chat.addMessage(_id, newMessage);
      if (result.modifiedCount === 0) {
        throw new CustomError(404, "Chat Not Found!");
      }

      res.status(200).json({ message: "Message successfully added." });
    } catch (error) {
      next(error);
    }
  }

  static async updateMessageInChat(req, res, next) {
    try {
      const { _id, messageId } = req.params;
      const { content } = req.body;

      if (!ObjectId.isValid(_id) || !ObjectId.isValid(messageId)) {
        throw new CustomError(400, "Invalid Chat ID or Message ID format!");
      }

      const result = await Chat.updateMessage(_id, messageId, content);
      if (result.modifiedCount === 0) {
        throw new CustomError(404, "No changes detected or Message Not Found!");
      }

      res.status(200).json({ message: "Message successfully updated." });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessageFromChat(req, res, next) {
    try {
      const { _id, messageId } = req.params;

      if (!ObjectId.isValid(_id) || !ObjectId.isValid(messageId)) {
        throw new CustomError(400, "Invalid Chat ID or Message ID format!");
      }

      const result = await Chat.removeMessage(_id, messageId);
      if (result.modifiedCount === 0) {
        throw new CustomError(404, "Message Not Found or Chat Not Found!");
      }

      res.status(200).json({ message: "Message successfully deleted." });
    } catch (error) {
      next(error);
    }
  }

  static async findChatByUser(req, res, next) {
    try {
      const { userId } = req.body;
      if (!ObjectId.isValid(userId)) {
        throw new CustomError(400, "Invalid User ID format!");
      }

      console.log(userId);

      const chatId = await Chat.findChatByUser(userId);
      if (!chatId) {
        throw new CustomError(404, "Chat not found for the provided user.");
      }

      res.status(200).json({ chatId });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatsController;
