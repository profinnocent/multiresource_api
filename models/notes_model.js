const db = require("../config/db");
const config = require("../config/config");
const helper = require("../helper");

// Get all notes
async function getNotes(page_no = 1) {
  const offset = helper.getOffset(page_no, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM notes LIMIT ${offset},${config.listPerPage}`
  );

  return { result: rows, count: rows.length, page_no: page_no };
}

// Get a single note
async function getNote(id) {
  const row = await db.query("SELECT * FROM notes WHERE note_id=?", [id]);
  const data = helper.emptyOrRows(row);

  return { data };
}

// Create a new note
async function createNote(user_id, title, contents) {
  const row = await db.query(
    "INSERT INTO notes (user_id, title, contents) VALUES(?, ?, ?)",
    [user_id, title, contents]
  );
  const data = helper.emptyOrRows(row);

  return { data };
}

// Update a specific note
async function updateNote(id, title, contents) {
  const row = await db.query(
    "UPDATE notes SET title=?, contents=? WHERE note_id=?",
    [title, contents, id]
  );
  const data = helper.emptyOrRows(row);

  return { data };
}

// Delete a specific note
async function deleteNote(id) {
  const row = await db.query("DELETE FROM notes WHERE note_id=?", [id]);
  const data = helper.emptyOrRows(row);

  return { data };
}

// Search for notes by title
async function searchNotesByTitle(title) {
  // const offset = helper.getOffset(page, config.listPerPage);

  const rows = await db.query(
    `SELECT * FROM notes WHERE (title LIKE '%${title}%') OR (contents LIKE '%${title}%')`
  );

  const data = helper.emptyOrRows(rows);

  return { data };

  // `SELECT * FROM notes WHERE title LIKE '%title%' LIMIT ${offset},${config.listPerPage}`

  // console.log("search row result", rows);
  // return {rows};
}

// Export all function so they are available for import
module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotesByTitle,
};
