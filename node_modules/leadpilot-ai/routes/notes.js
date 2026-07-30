const express = require("express");
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  createCallLog,
  updateNote,
  deleteNote,
  getCommunicationTimeline
} = require("../controllers/notesController");

// Note routes
router.get("/", getNotes);
router.get("/timeline/:lead_id", getCommunicationTimeline);
router.get("/:id", getNote);
router.post("/", createNote);
router.post("/call", createCallLog);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
