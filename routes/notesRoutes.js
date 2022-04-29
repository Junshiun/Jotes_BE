const {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getNotes);
router.route("/create").post(protect, createNote);
router
  .route("/:id")
  .get(protect, getNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
