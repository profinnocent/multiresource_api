const helper = require("../helper");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

const user_model = require("../models/user_model");

// Get all Users
async function getUsers(req, res, next) {
  try {
    res.json(await user_model.getUsers(req.query.page));
  } catch (err) {
    next(err);
  }
}

// Get a single user
async function getUser(req, res, next) {
  const id = req.params.id;

  if (!helper.isValidId(id)) {
    next({ statusCode: 400, message: "Pls provide a valid User Id" });
    return;
  }

  try {
    const user = await user_model.getUser(id);
    // console.log("array length: ", user);
    if (user.length === 0) {
      next({
        statusCode: 400,
        message: "User with this ID does not exist",
      });
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Create a new User
async function createUser(req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;

  if (!firstname || !lastname || !phone || !email || !password) {
    next({
      statusCode: 400,
      message: "Pls provide or fill all fields",
      resultCode: 0,
    });
    return;
  }

  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const stoken = randomstring.generate();
    const userData = [firstname, lastname, phone, email, hashPassword, stoken];
    const result = await user_model.createUser(userData);
    console.log(result);

    if (result.affectedRows === 1)
      return res.status(201).json({
        result: result,
        message: "New user created successfully",
        resultCode: 1,
      });

    return res.status(401).json({
      result: result,
      message: "Creation Failed. Please try again.",
      resultCode: 0,
    });
  } catch (err) {
    // console.error(`Error Createing user. Please try again`, err.message);
    next(err);
  }
}

// Update a User
async function updateUser(req, res, next) {
  const id = req.params.id;

  // Ensure id provided is valid
  if (helper.isValidId(id) === false) {
    next({ statusCode: 400, message: "Pls provide a valid User Id" });
    return;
  }

  // Check if User with Id exist
  const user = await user_model.getUser(id);
  console.log(user);

  if (user.length === 0) {
    next({ statusCode: 400, message: "User with this ID does not exist" });
    return;
  }

  const title =
    req.body.title === undefined || req.body.title === null
      ? user[0].title
      : req.body.title;
  const contents =
    req.body.contents === undefined || req.body.contents === null
      ? user[0].contents
      : req.body.contents;

  try {
    const { data } = await user_model.updateUser(id, title, contents);
    if (data.affectedRows === 1) {
      res
        .status(201)
        .json({ data: data, message: "user updated successfully" });
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

async function deleteUser(req, res, next) {
  const id = req.params.id;

  // Ensure id provided is valid
  if (helper.isValidId(id) === false) {
    next({ statusCode: 400, message: "Pls provide a valid User Id" });
    return;
  }

  // Check if User with Id exist
  const user = await user_model.getUser(id);

  if (user.length === 0) {
    next({ statusCode: 400, message: "User with this ID does not exist" });
    return;
  }

  try {
    const { data } = await user_model.deleteUser(req.params.id);

    if (data.affectedRows === 1) {
      res
        .status(201)
        .json({ data: data, message: "user deleted successfully" });
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

// Search for user
async function searchUser(req, res, next) {
  const title = req.params.title;

  try {
    const result = await user_model.searchuserByTitle(title);

    // Check if result is empty
    if (result.data.length === 0) {
      next({
        statusCode: 400,
        message: "No user matching the search name found",
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

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUser,
};

// const data = helper.emptyOrRows(rows);
// const meta = { page };

// return {
//   data,
//   meta,
// };
