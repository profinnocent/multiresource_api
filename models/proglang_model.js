const db = require("../config/db");
const helper = require("../helper");
const config = require("../config/config");

// Get all notes
async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM notes LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

// Get a single note
async function getSingle(id) {
  const row = await db.query(`SELECT * FROM notes WHERE note_id=${id}`);
  const data = helper.emptyOrRows(row);

  return { data };
}

// Create a new note
async function createNote(title, contents) {
  const row = await db.query(
    `INSERT INTO notes (title, contents) VALUES(${title}, ${contents})`
  );
  const data = helper.emptyOrRows(row);

  return { data };
}

module.exports = { getMultiple, getSingle, createNote };
