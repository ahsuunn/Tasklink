const AuthRouter = require("./AuthRouter");
const UploadsRouter = require("./UploadsRouter");
const ProfileRouter = require("./ProfileRouter");
const TasksRouter = require("./TasksRouter");
const ChatsRouter = require("./ChatRouter");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.use("/uploads", UploadsRouter);
router.use("/auth", AuthRouter);
router.use("/profile", ProfileRouter);
router.use("/task", TasksRouter);
router.use("/chat", ChatsRouter);

module.exports = router;
