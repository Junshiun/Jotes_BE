import notes from "@models/notesModel";
import connectMongo from "config/db";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
// const asyncHandler = require("express-async-handler");

const asyncHandler = expressAsyncHandler;

const getNotes = asyncHandler(async (req: Request, res: Response) => {

  const Notes = await notes.find({ user: res.locals.user._id });

  res.json(Notes);
});

const createNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, category } = req.body;

  const note = new notes({ title, content, category, user: res.locals.user._id });

  const noteCreated = await note.save();

  res.status(201).json(noteCreated);
});

const getNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await notes.findById(req.params.id);

  if (note) res.status(201).json(note);
  else throw new Error("note not found");
});

const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, category } = req.body;

  const note = await notes.findById(req.params.id);

  if (note) {
    note.title = title;
    note.content = content;
    note.category = category;

    const save = await note.save();

    res.json(save);
  } else {
    res.status(400);
    throw new Error("note not found");
  }
});

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await notes.findById(req.params.id);

  if (note) {
    note.remove();
    res.json({ message: "note successfully removes" });
  } else {
    res.status(401).json({
      errorDesc: "note not found"
    });
    // throw new Error("note not found");
  }
});

export { 
  getNotes, createNote, getNote, updateNote, deleteNote 
};
