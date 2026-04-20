const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true },
    city: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const createUser = async (name, email, password, city) => {
  await User.create({ name, email, password, city });
};

const findByEmail = async (email) => {
  return User.findOne({ email: String(email).toLowerCase().trim() });
};

const getAllUsers = async () => {
  return User.find().lean();
};

const getUsersByCity = async (city) => {
  const users = await User.find({ city })
    .select("name email city")
    .lean();
  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    city: u.city
  }));
};

module.exports = {
  createUser,
  findByEmail,
  getAllUsers,
  getUsersByCity
};
