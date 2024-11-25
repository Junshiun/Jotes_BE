import user from "@models/userModel";
import notes from "@models/notesModel";
// import asyncHandler from "express-async-handler";
import { generateToken } from "@utils/generateJWT";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";

const asyncHandler = expressAsyncHandler;

const registerUser = asyncHandler(async (req: Request, res: Response) => {

  console.log("registering");

  const { name, email, password } = req.body;

  const userExists = await user.findOne({ email });

  if (userExists) {
    res.status(400).json({
      errorDesc: "Users with the same email address already exists"
    });
    // throw new Error("Users with the same email address already exists");
  }

  const userCreate = await user.create({ name, email, password });

  if (userCreate) {
    res.status(201).json({
      _id: userCreate._id,
      name: userCreate.name,
      email: userCreate.email,
      isAdmin: userCreate.isAdmin,
      token: generateToken(userCreate._id),
    });
  } else {
    res.status(400).json({
      errorDesc: "Error occurs when creating user"
    });
    // throw new Error("Error occurs when creating user");
  }
});

const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const currentUser = await user.findOne({ email });

  if (currentUser && (await currentUser.comparePwd(password))) {
    res.json({
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin,
      token: await generateToken(currentUser._id),
    });
  } else {
    res.status(400).json({
      errorDesc: "Invalid Email or Password"
    });
    // throw new Error("Invalid Email or Password");
  }
});

const editUser = asyncHandler(async (req: Request, res: Response) => {
  console.log("editing");
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
      res.status(400).json({
        errorDesc: "invalid password"
      });
    }
  } else {
    res.status(400).json({
      errorDesc: "user not found"
    });
  }
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
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

export { registerUser, authUser, editUser, deleteUser };
