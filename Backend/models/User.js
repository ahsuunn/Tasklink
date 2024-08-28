const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/MongoConnect");

class User {
  constructor({
    _id,
    username,
    lastName,
    email,
    password,
    displayName,
    role,
    profilePicUrl,
    major,
    yearOfEntry,
    friends = [],
    friendrequests = [],
  }) {
    Object.assign(this, {
      _id,
      username,
      lastName,
      email,
      password,
      displayName,
      role,
      profilePicUrl,
      major,
      yearOfEntry,
      friends,
      friendrequests,
    });
  }

  static async collection() {
    return getDatabase().collection("Users");
  }

  static async findAll(query = {}) {
    const collection = await User.collection();
    const data = await collection.find(query).toArray();
    return data.map((el) => new User(el));
  }

  static async findOne(query = {}) {
    const collection = await User.collection();
    const myData = await collection.findOne(query);
    return myData;
  }

  static async create({
    username,
    lastName,
    email,
    password,
    displayName = "User",
    role = "student",
    profilePicUrl = "",
    major = "",
    yearOfEntry = "",
    friends = [],
    friendrequests = [],
  }) {
    const collection = await User.collection();
    const result = await collection.insertOne({
      username,
      lastName,
      email,
      password,
      displayName,
      role,
      profilePicUrl,
      major,
      yearOfEntry,
      friends,
      friendrequests,
    });
    return result;
  }

  static async deleteById(_id) {
    const collection = await User.collection();
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    return result;
  }

  static async updateById(_id, updateDoc) {
    const collection = await User.collection();
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, updateDoc);
    return result;
  }

  static async addFriend(userId, friendId, chatId, displayName, lastName, major) {
    const collection = await User.collection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: {
          friends: {
            _id: new ObjectId(),
            friendid: friendId,
            chatId: chatId,
            displayName: displayName,
            lastName: lastName,
            major: major,
          },
        },
      }
    );
    return result;
  }

  static async addFriendRequest(userId, requesterId) {
    const collection = await User.collection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: {
          friendrequests: {
            _id: new ObjectId(),
            senderid: requesterId,
          },
        },
      }
    );
    return result;
  }

  static async removeFriendRequest(userId, requesterId) {
    const collection = await User.collection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { friendrequests: { senderid: requesterId } } }
    );
    return result;
  }

  static async removeFriend(userId, friendId, chatId) {
    const collection = await User.collection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { friends: { friendid: friendId, chatId: chatId } } }
    );
    return result;
  }
}

module.exports = User;
