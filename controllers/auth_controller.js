const helper = require("../helper");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

const user_model = require("../models/user_model");

// Login a User
async function loginUser(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send({
      message: "Please provide an email and password",
      resultCode: 0,
    });
  }

  try {
    //   Check if user already exists
    const user = await user_model.userEmailCheck(email);
    console.log(user);
    if (user.length > 0) {
      //   Check if password is correct
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user[0].password
      );

      if (isPasswordCorrect) {
        // user[0].password = xxxxxxxxxxxxxxxxxxxxxxxx;
        // user[0].stoken = xxxxxxxxxxxxxxxxxxxxxxxxxx;

        const jwtoken = jwt.sign(
          {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
          },
          process.env.JWTKEY,
          {
            expiresIn: "2h",
          }
        );

        return res.status(200).send({
          message: "Login Successful",
          resultCode: 1,
          token: jwtoken,
          user: user,
        });
      }
    }

    return res.status(400).send({
      message: "Wrong email or password",
      resultCode: 0,
    });
  } catch (err) {
    next(err);
  }
}

// Decode jwt and identify user
async function getMe(req, res, next) {
  const jwtoken =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!jwtoken) {
    return res.status(403).json({
      message: "AccessToken missing, You are not authenticated",
      resultCode: 0,
    });
  }

  try {
    const decoded_jwt = jwt.verify(jwtoken, process.env.JWTKEY);
    req.user = decoded_jwt;
    res.json(decoded_jwt);
  } catch (err) {
    next(err);
  }
}

// Register a new User
async function registerUser(req, res, next) {
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

  //   Check if user already exists
  const user = await user_model.userEmailCheck(email);
  console.log(user);
  if (user.length > 0) {
    return res.status(400).send({
      message: "User already exists. Please register with a different email",
      resultCode: 0,
    });
  }

  //   return res.status(200).send({
  //     message: "Procced to register user",
  //     resultCode: 0,
  //   });

  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const stoken = randomstring.generate();
    console.log(stoken);
    const userData = [firstname, lastname, phone, email, hashPassword, stoken];
    const result = await user_model.createUser(userData);
    console.log(result);

    if (result.affectedRows === 1) {
      const accesstoken = jwt.sign(
        {
          id: result.insertId,
          firstname: firstname,
          lastname: lastname,
          phone: phone,
          email: email,
        },
        process.env.JWTKEY,
        {
          expiresIn: "2h",
        }
      );

      return res.status(201).json({
        result: result,
        accesstoken: accesstoken,
        message: "New user created successfully",
        resultCode: 1,
      });
    }

    return res.status(401).json({
      result: result,
      message: "Creation Failed. Please try again.",
      resultCode: 0,
    });
  } catch (err) {
    next(err);
  }
}

// Update a User
async function generateToken(req, res, next) {
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

async function verifyToken(req, res, next) {
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
async function logoutUser(req, res, next) {
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
  loginUser,
  getMe,
  logoutUser,
  registerUser,
  generateToken,
  verifyToken,
};

// const data = helper.emptyOrRows(rows);
// const meta = { page };

// return {
//   data,
//   meta,
// };
