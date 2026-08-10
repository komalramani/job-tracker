const cors = require("cors");
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Tracker API is running");
});

// GET from PostgreSQL
app.get("/applications", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST to PostgreSQL
app.post("/applications", async (req, res) => {
  try {
    const { company, role, status } = req.body;

    const result = await pool.query(
      `INSERT INTO applications (company, role, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [company, role, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});