const express = require("express");
const proglang_router = express.Router();
const proglang_model = require("../models/notes_model");

/* GET all Notes. */
proglang_router.get("/notes", async function (req, res, next) {
  try {
    res.json(await proglang_model.getMultiple(req.query.page));
  } catch (err) {
    console.error(
      `Error while getting the programming languages. Please try again.`,
      err.message
    );
    next(err);
  }
});

/* GET a single Note. */
proglang_router.get("/proglang/:id", async function (req, res, next) {
  try {
    res.json(await proglang_model.getSingle(req.params.id));
  } catch (err) {
    console.error(
      `Error while getting the programming language. Please try again `,
      err.message
    );
    next(err);
  }
});

/* POST: Create a new Note. */
proglang_router.post("/proglang", async function (req, res, next) {
  try {
    res.json(await proglang_model.createNote(title, contents));
  } catch (err) {
    console.error(
      `Error Createing programming language. Please try again`,
      err.message
    );
    next(err);
  }
});

module.exports = proglang_router;
