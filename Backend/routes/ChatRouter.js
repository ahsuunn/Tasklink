const ChatsController = require("../controllers/ChatController");
const Authentication = require("../middlewares/Authentication");

const ChatsRouter = require("express").Router();

ChatsRouter.get("/", Authentication, ChatsController.getAllChats);
ChatsRouter.get("/mine", Authentication, ChatsController.getUserChats);
ChatsRouter.get("/:_id", Authentication, ChatsController.getOneChat);
ChatsRouter.post("/", Authentication, ChatsController.createChat);
ChatsRouter.delete("/:_id", Authentication, ChatsController.deleteChat);
ChatsRouter.post("/:_id/messages", Authentication, ChatsController.addMessageToChat);
ChatsRouter.put("/:_id/messages/:messageId", Authentication, ChatsController.updateMessageInChat);
ChatsRouter.delete("/:_id/messages/:messageId", Authentication, ChatsController.deleteMessageFromChat);

module.exports = ChatsRouter;
