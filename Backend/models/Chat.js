const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/MongoConnect");

class Chat {
  constructor({ _id, userone, usertwo, chatcontent = [] }) {
    Object.assign(this, { _id, userone, usertwo, chatcontent });
  }

  static async collection() {
    return getDatabase().collection("Chats");
  }

  static async findAll(query) {
    const collection = await Chat.collection();
    const data = await collection.find(query).toArray();
    return data.map((el) => new Chat(el));
  }

  static async findOne(query) {
    const collection = await Chat.collection();
    const chatData = await collection.findOne(query);
    return chatData ? new Chat(chatData) : null;
  }

  static async create({ userone, usertwo, chatcontent = [] }) {
    const collection = await Chat.collection();
    const result = await collection.insertOne({
      userone,
      usertwo,
      chatcontent,
    });
    return result;
  }

  static async deleteById(_id) {
    const collection = await Chat.collection();
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    return result;
  }

  static async updateById(_id, updateDoc) {
    const collection = await Chat.collection();
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateDoc });
    return result;
  }

  static async addMessage(_id, message) {
    const collection = await Chat.collection();

    console.log("......");
    console.log(message);
    console.log("......");
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, { $push: { chatcontent: message } });
    return result;
  }

  static async removeMessage(_id, messageId) {
    const collection = await Chat.collection();
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $pull: { chatcontent: { _id: new ObjectId(messageId) } } }
    );
    return result;
  }

  static async updateMessage(_id, messageId, updatedContent) {
    const collection = await Chat.collection();
    const result = await collection.updateOne(
      { _id: new ObjectId(_id), "chatcontent._id": new ObjectId(messageId) },
      { $set: { "chatcontent.$.content": updatedContent } }
    );
    return result;
  }

  static async findChatByUser(userId) {
    const collection = await Chat.collection();
    const query = { $or: [{ userone: userId }, { usertwo: userId }] };
    const chat = await collection.findOne(query);
    return chat ? chat._id : null;
  }
}

module.exports = Chat;
