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
    { username: "overseer" },
    {
      username: "overseer",
      password: getHashedString("overseer123"),
      role: "admin",
    }
  );
};

module.exports = initialSeeding;
