const express = require("express");
const notes_router = express.Router();
const notes_controller = require("../controllers/notes_controller");

/* GET all Notes. */
notes_router.get("/", notes_controller.getNotes);

/* GET a single Note. */
notes_router.get("/:id", notes_controller.getNote);

/* POST: Create a new Note. */
notes_router.post("/", notes_controller.createNote);

/* PUT: Update a Note. */
notes_router.put("/:id", notes_controller.updateNote);

/* GET: Delete a Note. */
notes_router.delete("/:id", notes_controller.deleteNote);

// Search for note(s) by title
notes_router.get("/search/:title", notes_controller.searchNote);

// Export router so it can be imported into other files
module.exports = notes_router;
