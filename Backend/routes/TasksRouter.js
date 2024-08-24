const TasksController = require("../controllers/TasksController");
const Authentication = require("../middlewares/Authentication");

const TasksRouter = require("express").Router();

TasksRouter.get("/", TasksController.getAll);
TasksRouter.get("/mine", Authentication, TasksController.getMyTasks);
TasksRouter.get("/:_id", Authentication, TasksController.getOneTask);
TasksRouter.post("/", Authentication, TasksController.createTask);
TasksRouter.delete("/:_id", Authentication, TasksController.deleteTask);
TasksRouter.put("/:_id", Authentication, TasksController.updateTask);

TasksRouter.put("/:_id/steps/:stepId", Authentication, TasksController.updateTaskStep);
module.exports = TasksRouter;
