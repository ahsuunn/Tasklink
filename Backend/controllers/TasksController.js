const { ObjectId } = require("bson");
const Task = require("../models/Task");
const { CustomError } = require("../middlewares/Errorhandler");
const User = require("../models/User");

class TasksController {
  static async getAll(req, res, next) {
    try {
      const Data = await Task.findAll();
      res.status(200).json(Data);
    } catch (error) {
      next(error);
    }
  }

  static async getMyTasks(req, res, next) {
    try {
      const TaskUserId = res.locals.user._id;
      const Data = await Task.findAll({ TaskUserId });
      res.status(200).json(Data);
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req, res, next) {
    try {
      const TaskUserId = res.locals.user._id;
      const { title, description, deadline, priority, category } = req.body;

      const result = await Task.create({
        TaskUserId,
        title,
        description,
        deadline,
        priority,
        category,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const { _id } = req.params;

      const result = await Task.deleteById(_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { title, description, deadline, priority, category } = req.body;
      const { _id } = req.params;
      const TaskUserId = res.locals.user._id;

      const existingTask = await Task.findOne({ _id: new ObjectId(_id) });

      if (!existingTask) throw new CustomError(404, "Post Not Found!");
      if (existingTask.TaskUserId !== TaskUserId) throw new CustomError(401, "Post is not yours!");

      await Post.updateById(_id, {
        title: title,
        description: description,
        deadline: deadline,
        priority: priority,
        category: category,
      });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TasksController;
