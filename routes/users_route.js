const express = require("express");
const user_router = express.Router();
const user_controller = require("../controllers/user_controller");

/* ----------------- Open routes ----------------------- */
/* GET all user. */
user_router.get("/", user_controller.getUsers);

/* GET a single User. */
user_router.get("/:id", user_controller.getUser);

// GET : Search for User(s) by title
user_router.get("/search/:title", user_controller.searchUser);

/* POST: Create a new User. */
user_router.post("/create-user", user_controller.createUser);

/* ----------------- Autheticated routes ------------------- */

/* PUT: Update a User. */
user_router.put("/:id", user_controller.updateUser);

/* GET: Delete a User. */
user_router.delete("/:id", user_controller.deleteUser);

// Export router so it can be imported into other files
module.exports = user_router;
