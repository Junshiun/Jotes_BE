const user = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateJWT");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await user.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Users with the same email address already exists");
  }

  const userCreate = await user.create({ name, email, password });

  if (userCreate) {
    res.status(201).json({
      _id: userCreate._id,
      name: userCreate.name,
      email: userCreate.email,
      isAdmin: userCreate.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Error occurs when creating user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const currentUser = await user.findOne({ email });

  if (currentUser && (await currentUser.comparePwd(password))) {
    res.json({
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin,
      token: generateToken(currentUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { registerUser, authUser };
