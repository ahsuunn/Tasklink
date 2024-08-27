const ProfileController = require("../controllers/ProfileController");
const Authentication = require("../middlewares/Authentication");

const ProfileRouter = require("express").Router();

ProfileRouter.get("/alluser", ProfileController.getAll);
ProfileRouter.get("/:email", ProfileController.getByEmail);
ProfileRouter.put("/:_id", Authentication, ProfileController.updateById);

ProfileRouter.post("/friends/add", Authentication, ProfileController.addFriend);
ProfileRouter.post("/friends/remove", Authentication, ProfileController.removeFriend);
ProfileRouter.post("/friendrequests/send", Authentication, ProfileController.addFriendRequest);
ProfileRouter.post("/friendrequests/remove", Authentication, ProfileController.removeFriendRequest);

module.exports = ProfileRouter;
