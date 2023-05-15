require("dotenv").config();

const config = {
  db: {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
  },
  listPerPage: 10,
};
module.exports = config;
