const TasksController = require("../controllers/TasksController");
const Authentication = require("../middlewares/Authentication");

const TasksRouter = require("express").Router();

TasksRouter.get("/", TasksController.getAll);
TasksRouter.get("/mine", Authentication, TasksController.getMyTasks);
TasksRouter.post("/", Authentication, TasksController.createTask);
TasksRouter.delete("/:_id", Authentication, TasksController.deleteTask);
TasksRouter.put("/:_id", Authentication, TasksController.updateTask);
module.exports = TasksRouter;
