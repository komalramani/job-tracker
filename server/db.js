const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database:
  process.env.NODE_ENV === "test"
    ? process.env.DB_TEST_NAME
    : process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

module.exports = pool;