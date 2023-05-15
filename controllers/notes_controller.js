// const express = require("express");
const helper = require("../helper");

// const notes_router = express.Router();
const notes_model = require("../models/notes_model");

/* GET all Notes. */
async function getNotes(req, res, next) {
  try {
    let page = req.query.page;
    // page = 2;
    res.json(await notes_model.getNotes(page));
  } catch (err) {
    // console.error(`Error while getting notes. Please try again.`, err.message);
    next(err);
  }
}

/* GET a single Note. */
async function getNote(req, res, next) {
  const id = req.params.id;

  if (!helper.isValidId(id)) {
    next({ statusCode: 400, message: "Pls provide a valid Note Id" });
    return;
  }

  try {
    const note = await notes_model.getNote(id);
    // console.log("array length: ", note.data.length);
    if (note.data.length === 0) {
      next({
        statusCode: 400,
        message: "Note with this ID does not exist",
      });
      return;
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
}

/* POST: Create a new Note. */
async function createNote(req, res, next) {
  const user_id = req.body.user_id;
  const title = req.body.title;
  const contents = req.body.contents;

  if (!user_id) {
    next({ statusCode: 400, message: "User ID is missing", resultCode: 0 });
    return;
  }

  if (!title || !contents) {
    next({
      statusCode: 400,
      message: "Pls provide or fill all fields",
      resultCode: 0,
    });
    return;
  }

  try {
    const { data } = await notes_model.createNote(user_id, title, contents);

    if (data.affectedRows === 1) {
      res.status(201).json({
        data: data,
        message: "New Notes created successfully",
        resultCode: 1,
      });
      return;
    }

    res.status(401).json({
      data: data,
      message: "Creation Failed. Please try again.",
      resultCode: 0,
    });
    return;
  } catch (err) {
    // console.error(`Error Createing notes. Please try again`, err.message);
    next(err);
  }
}

/* PUT: Update a Note. */
async function updateNote(req, res, next) {
  const id = req.params.id;

  // Ensure id provided is valid
  if (helper.isValidId(id) === false) {
    next({ statusCode: 400, message: "Pls provide a valid Note Id" });
    return;
  }

  // Check if note with Id exist
  const note = await notes_model.getNote(id);

  if (note.data.length === 0) {
    next({ statusCode: 400, message: "Note with this ID does not exist" });
    return;
  }

  const title =
    req.body.title === undefined || req.body.title === null
      ? note.data[0].title
      : req.body.title;
  const contents =
    req.body.contents === undefined || req.body.contents === null
      ? note.data[0].contents
      : req.body.contents;

  try {
    const { data } = await notes_model.updateNote(id, title, contents);
    if (data.affectedRows === 1) {
      res
        .status(201)
        .json({ data: data, message: "Notes updated successfully" });
      return;
    }

    res
      .status(401)
      .json({ data: data, message: "Update Failed. Please try again." });
    return;
  } catch (err) {
    next(err);
  }
}

/* GET: Delete a Note. */
async function deleteNote(req, res, next) {
  const id = req.params.id;

  // Ensure id provided is valid
  if (helper.isValidId(id) === false) {
    next({ statusCode: 400, message: "Pls provide a valid Note Id" });
    return;
  }

  // Check if note with Id exist
  const note = await notes_model.getNote(id);

  if (note.data.length === 0) {
    next({ statusCode: 400, message: "Note with this ID does not exist" });
    return;
  }

  try {
    const { data } = await notes_model.deleteNote(req.params.id);

    if (data.affectedRows === 1) {
      res
        .status(201)
        .json({ data: data, message: "Notes deleted successfully" });
      return;
    }

    res
      .status(401)
      .json({ data: data, message: "Delete Failed. Please try again." });
    return;
  } catch (err) {
    next(err);
  }
}

// Search for note(s) by title
async function searchNote(req, res, next) {
  const title = req.params.title;

  try {
    const result = await notes_model.searchNotesByTitle(title);

    // Check if result is empty
    if (result.data.length === 0) {
      next({
        statusCode: 400,
        message: "No Notes matching the search name found",
      });
      return;
    }

    res.status(202).json({
      data: result.data,
      count: result.data.length,
      message: "Found these results",
    });
  } catch (err) {
    next(err);
  }
}

// Export router so it can be imported into other files
module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNote,
};
