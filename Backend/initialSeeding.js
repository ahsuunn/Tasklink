const User = require("./models/User");
const { getHashedString } = require("./helpers/bcrypt");

const createIfNotExists = async (Model, query, data) => {
  const existingItem = await Model.findOne(query);
  if (!existingItem) {
    await Model.create(data);
  }
};

const initialSeeding = async () => {
  await createIfNotExists(
    User,
    { email: "overseer@example.com" },
    {
      username: "overseer",
      lastName: "Admin",
      email: "overseer@example.com",
      password: getHashedString("overseer123"),
      displayName: "John",
      role: "admin",
      profilePicUrl: "",
      major: "IF'00",
      yearOfEntry: 2024,
    }
  );
};

module.exports = initialSeeding;
