const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user:"postgres",
    host:"127.0.0.1",
    database:"social",
    password:process.env.db_password,
    port: 1111
})

module.exports = pool;