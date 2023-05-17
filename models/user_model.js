const db = require("../config/db");
const helper = require("../helper");
const config = require("../config/config");

// Get all notes
async function getUsers(page_no = 1) {
  const offset = helper.getOffset(page_no, config.listPerPage);
  const result = await db.query(
    `SELECT * FROM users WHERE id > 7 LIMIT ${offset},${config.listPerPage}`
  );
  return { result: result, count: result.length, page_no: page_no };
}

// Get a single User
async function getUser(id) {
  const result = await db.query("SELECT * FROM users WHERE (id>7 AND id=?)", [
    id,
  ]);
  return result;
}

// Create a new User
async function createUser(userData) {
  const result = await db.query(
    "INSERT INTO users (firstname, lastname, phone, email, password, stoken) VALUES(?, ?, ?, ?, ?, ?)",
    userData
  );

  return result;
}

// Update a specific User
async function updateUser(id, title, contents) {
  const result = await db.query(
    "UPDATE users SET title=?, contents=? WHERE (id>7 AND id=?)",
    [title, contents, id]
  );

  return result;
}

// Delete a specific User
async function deleteUser(id) {
  const result = await db.query("DELETE FROM users WHERE (id>7 AND id=?)", [
    id,
  ]);

  return result;
}

// Search for Users by title
async function searchUsersByTitle(title) {
  const result = await db.query(
    `SELECT * FROM users WHERE (id>7 AND (title LIKE '%${title}%') OR (contents LIKE '%${title}%'))`
  );

  return result;
}

// Check if a user email exists
async function userEmailCheck(email) {
  const result = await db.query(
    "SELECT * FROM users WHERE (id>7 AND email=?)",
    [email]
  );
  return result;
}

// Export all function so they are available for import
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsersByTitle,
  userEmailCheck,
};
