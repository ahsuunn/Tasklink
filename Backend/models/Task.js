const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/MongoConnect");

class Task {
  constructor({ _id, TaskUserId, title, description, deadline, priority, category }) {
    Object.assign(this, {
      _id,
      TaskUserId,
      title,
      description,
      deadline,
      priority,
      category,
    });
  }

  static async collection() {
    return getDatabase().collection("Tasks");
  }

  static async findAll(query) {
    const collection = await Task.collection();
    const data = await collection.find(query).toArray();
    return data.map((el) => new Task(el));
  }

  static async findOne(query) {
    const collection = await Task.collection();
    const myData = await collection.findOne(query);
    return myData;
  }

  static async create({ TaskUserId, title, description, deadline, priority, category }) {
    const collection = await Task.collection();
    const result = await collection.insertOne({
      TaskUserId,
      title,
      description,
      deadline,
      priority,
      category,
    });
    return result;
  }

  static async deleteById(_id) {
    const collection = await Task.collection();
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    return result;
  }

  static async updateById(_id, updateDoc) {
    const collection = await Task.collection();
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, updateDoc);
    return result;
  }
}

module.exports = Task;
