const notes = require("../models/notesModel");
const asyncHandler = require("express-async-handler");

const getNotes = asyncHandler(async (req, res) => {
  const Notes = await notes.find({ user: req.user._id });

  res.json(Notes);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  const note = new notes({ title, content, category, user: req.user._id });

  const noteCreated = await note.save();

  res.status(201).json(noteCreated);
});

const getNote = asyncHandler(async (req, res) => {
  const note = await notes.findById(req.params.id);

  if (note) res.status(201).json(note);
  else throw new Error("note not found");
});

const updateNote = asyncHandler(async (req, res) => {
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

const deleteNote = asyncHandler(async (req, res) => {
  const note = await notes.findById(req.params.id);

  if (note) {
    note.remove();
    res.json({ message: "note successfully removes" });
  } else {
    res.status(401);
    throw new Error("note not found");
  }
});

module.exports = { getNotes, createNote, getNote, updateNote, deleteNote };
