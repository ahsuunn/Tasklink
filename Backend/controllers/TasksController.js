const { ObjectId } = require("bson");
const Task = require("../models/Task");
const { CustomError } = require("../middlewares/Errorhandler");

class TasksController {
  static async getAll(req, res, next) {
    try {
      const data = await Task.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getMyTasks(req, res, next) {
    try {
      const TaskUserId = res.locals.user._id;
      const data = await Task.findAll({ TaskUserId });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getOneTask(req, res, next) {
    try {
      const { _id } = req.params;

      if (!ObjectId.isValid(_id)) {
        throw new CustomError(400, "Invalid Task ID format!");
      }

      const task = await Task.findOne({ _id: new ObjectId(_id) });

      if (!task) {
        throw new CustomError(404, "Task Not Found!");
      }

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req, res, next) {
    try {
      const TaskUserId = res.locals.user._id;
      const { primarytitle, secondarytitle, numberofsteps, deadlinedate, deadlinetime, color, steps } = req.body;

      const result = await Task.create({
        TaskUserId,
        primarytitle,
        secondarytitle,
        numberofsteps,
        deadlinedate,
        deadlinetime,
        color,
        steps,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const { _id } = req.params;

      const result = await Task.deleteById(_id);
      if (result.deletedCount === 0) {
        throw new CustomError(404, "Task Not Found!");
      }

      res.status(200).json({ message: "Task successfully deleted." });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { primarytitle, secondarytitle, numberofsteps, deadlinedate, deadlinetime, color, steps } = req.body;
      const { _id } = req.params;
      const TaskUserId = res.locals.user._id;

      const existingTask = await Task.findOne({ _id: new ObjectId(_id) });

      if (!existingTask) throw new CustomError(404, "Task Not Found!");
      if (existingTask.TaskUserId !== TaskUserId) throw new CustomError(401, "Task is not yours!");

      const updateDoc = {
        ...(primarytitle && { primarytitle }),
        ...(secondarytitle && { secondarytitle }),
        ...(numberofsteps && { numberofsteps }),
        ...(deadlinedate && { deadlinedate }),
        ...(deadlinetime && { deadlinetime }),
        ...(color && { color }),
        ...(steps && { steps }),
      };

      const result = await Task.updateById(_id, updateDoc);
      if (result.modifiedCount === 0) {
        throw new CustomError(404, "No changes detected or Task Not Found!");
      }

      res.status(200).json({ message: "Task successfully updated." });
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskStep(req, res, next) {
    try {
      const { _id, stepId } = req.params;
      const { steptitle, stepdescription, deadlinedate, deadlinetime, category } = req.body;
      const TaskUserId = res.locals.user._id;

      if (!ObjectId.isValid(_id) || !ObjectId.isValid(stepId)) {
        throw new CustomError(400, "Invalid Task or Step ID format!");
      }

      const task = await Task.findOne({ _id: new ObjectId(_id) });

      if (!task) throw new CustomError(404, "Task Not Found!");
      if (task.TaskUserId !== TaskUserId) throw new CustomError(401, "Task is not yours!");

      const updatedStep = {
        ...(steptitle && { steptitle }),
        ...(stepdescription && { stepdescription }),
        ...(deadlinedate && { deadlinedate }),
        ...(deadlinetime && { deadlinetime }),
        ...(category && { category }),
      };

      const result = await Task.updateStepById(_id, stepId, updatedStep);
      if (result.modifiedCount === 0) {
        throw new CustomError(404, "No changes detected or Step Not Found!");
      }

      res.status(200).json({ message: "Step successfully updated." });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TasksController;
