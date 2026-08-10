const { Pool } = require("pg");

const pool = new Pool({
  user: "komalramani",
  host: "localhost",
  database: "job_tracker",
  port: 5432,
});

module.exports = pool;