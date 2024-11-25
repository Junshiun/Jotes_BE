import { getNote, createNote, deleteNote, getNotes, updateNote } from "@controllers/notesController";
import express from "express";
import { protect } from "@middleware/authMiddleware"
import ServerlessHttp from "serverless-http";
import connectMongo from "config/db";
import { cors } from "@middleware/cors";

const app = express();
app.use(cors);
app.use(connectMongo);
app.use(express.json());

const router = express.Router();

router.route("/").get(protect, getNotes);
router.route("/create").post(protect, createNote);
router
  .route("/:id")
  .get(protect, getNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

app.use("/notes", router);

// app.get("/notes", getNotes)

export const handler = ServerlessHttp(app);

// export default router;
  