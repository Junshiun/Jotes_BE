const user = require("../models/userModel");
const notes = require("../models/notesModel");
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

const editUser = asyncHandler(async (req, res) => {
  const { password, name, email, changePwd, newPassword } = req.body;

  const currentUser = await user.findOne({ email });

  if (currentUser) {
    if (await currentUser.comparePwd(password)) {
      if (changePwd === true) currentUser.password = newPassword;
      currentUser.name = name;

      const save = await currentUser.save();

      res.status(201).json({
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin,
        token: generateToken(currentUser._id),
      });
    } else {
      res.status(400);
      throw new Error("invalid password");
    }
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const currentUser = await user.findOne({ email });

  let userNotes;

  if (currentUser) {
    if (await currentUser.comparePwd(password)) {
      userNotes = await notes.find({ user: currentUser._id });

      if (userNotes) {
        for (let i = 0; i < userNotes.length; i++) userNotes[i].remove();
      }

      currentUser.remove();

      res.status(201).json({
        message: "success",
      });
    } else {
      res.status(400);
      throw new Error("invalid password");
    }
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

module.exports = { registerUser, authUser, editUser, deleteUser };
