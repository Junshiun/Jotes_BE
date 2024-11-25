import express from "express";
import {
  registerUser,
  authUser,
  editUser,
  deleteUser,
} from "@controllers/userController";
import ServerlessHttp from "serverless-http";
import connectMongo from "config/db";
import { cors } from "@middleware/cors";

const app = express();

app.use(cors);
app.use(connectMongo);
app.use(express.json());

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/profile").put(editUser).delete(deleteUser);

app.use("/user", router);

export const handler = ServerlessHttp(app);
