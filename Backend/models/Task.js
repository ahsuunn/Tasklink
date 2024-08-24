const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/MongoConnect");

class Task {
  constructor({ _id, TaskUserId, primarytitle, secondarytitle, numberofsteps, deadlinedate, deadlinetime, color, steps = [] }) {
    Object.assign(this, {
      _id,
      TaskUserId,
      primarytitle,
      secondarytitle,
      numberofsteps,
      deadlinedate,
      deadlinetime,
      color,
      steps: steps.map((step) => ({
        _id: step._id || new ObjectId(),
        steptitle: step.steptitle,
        stepdescription: step.stepdescription,
        deadlinedate: step.deadlinedate,
        deadlinetime: step.deadlinetime,
        category: step.category,
      })),
    });
  }

  static async collection() {
    return getDatabase().collection("Tasks");
  }

  static async findAll(query = {}) {
    const collection = await Task.collection();
    const data = await collection.find(query).toArray();
    return data.map((el) => new Task(el));
  }

  static async findOne(query) {
    const collection = await Task.collection();
    const data = await collection.findOne(query);
    return data ? new Task(data) : null;
  }

  static async create({ TaskUserId, primarytitle, secondarytitle, numberofsteps, deadlinedate, deadlinetime, color, steps }) {
    const collection = await Task.collection();
    const result = await collection.insertOne({
      TaskUserId,
      primarytitle,
      secondarytitle,
      numberofsteps,
      deadlinedate,
      deadlinetime,
      color,
      steps: steps.map((step) => ({
        _id: step._id || new ObjectId(),
        steptitle: step.steptitle,
        stepdescription: step.stepdescription,
        deadlinedate: step.deadlinedate,
        deadlinetime: step.deadlinetime,
        category: step.category,
      })),
    });
    return result;
  }

  static async deleteById(_id) {
    const collection = await Task.collection();
    return collection.deleteOne({ _id: new ObjectId(_id) });
  }

  static async updateById(_id, updateDoc) {
    const collection = await Task.collection();
    const updateFields = {
      ...(updateDoc.primarytitle && { primarytitle: updateDoc.primarytitle }),
      ...(updateDoc.secondarytitle && { secondarytitle: updateDoc.secondarytitle }),
      ...(updateDoc.numberofsteps && { numberofsteps: updateDoc.numberofsteps }),
      ...(updateDoc.deadlinedate && { deadlinedate: updateDoc.deadlinedate }),
      ...(updateDoc.deadlinetime && { deadlinetime: updateDoc.deadlinetime }),
      ...(updateDoc.color && { color: updateDoc.color }),
      ...(updateDoc.steps && {
        steps: updateDoc.steps.map((step) => ({
          _id: step._id || new ObjectId(),
          steptitle: step.steptitle,
          stepdescription: step.stepdescription,
          deadlinedate: step.deadlinedate,
          deadlinetime: step.deadlinetime,
          category: step.category,
        })),
      }),
    };

    return collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateFields });
  }

  static async updateStepById(taskId, stepId, updatedStep) {
    const collection = await Task.collection();
    return collection.updateOne(
      { _id: new ObjectId(taskId), "steps._id": new ObjectId(stepId) },
      {
        $set: {
          "steps.$.steptitle": updatedStep.steptitle,
          "steps.$.stepdescription": updatedStep.stepdescription,
          "steps.$.deadlinedate": updatedStep.deadlinedate,
          "steps.$.deadlinetime": updatedStep.deadlinetime,
          "steps.$.category": updatedStep.category,
        },
      }
    );
  }
}

module.exports = Task;
