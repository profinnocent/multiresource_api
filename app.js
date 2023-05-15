const express = require("express");
require("dotenv").config();

// Import all Resource Routers
const auth_router = require("./routes/auth_route");
const user_route = require("./routes/users_route");
const notes_router = require("./routes/notes_route");
const proglang_router = require("./routes/proglang_route");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Multi-Resource API app built with Node and MySQL",
  });
});

// Users Route
app.use("/api/users", user_route);

// Auth Route
app.use("/api/auth", auth_router);

// Notes route
app.use("/api/notes", notes_router);

// Programming languages route
app.use("/api/proglang", proglang_router);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // console.error(err.message);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Notes app server listening at http://localhost:${port}`);
});
