const express = require("express");
const helper = require("../helper");

const auth_router = express.Router();
const auth_controller = require("../controllers/auth_controller");

/* Login a User */
auth_router.post("/login", auth_controller.loginUser);

/* Decode and Identify a logged in user. */
auth_router.get("/get-me", auth_controller.getMe);

/* POST: Register a new Note. */
auth_router.post("/register", auth_controller.registerUser);

/* PUT: Update a Note. */
auth_router.post("/logout", auth_controller.logoutUser);

/* Generate user access token. */
auth_router.post("/generate-token", auth_controller.generateToken);

// Verify weather user access token is valid
auth_router.post("/verify-token", auth_controller.verifyToken);

// Export router so it can be imported into other files
module.exports = auth_router;
