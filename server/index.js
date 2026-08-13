require("dotenv").config();
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
    const {
  company,
  role,
  status,
  application_date,
  job_link,
  notes,
  follow_up_date,
} = req.body;

    const result = await pool.query(
  `INSERT INTO applications (
    company,
    role,
    status,
    application_date,
    job_link,
    notes,
    follow_up_date
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`,
  [
    company,
    role,
    status,
    application_date || null,
    job_link || null,
    notes || null,
    follow_up_date || null,
  ]
);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
// UPDATE application
app.put("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      role,
      status,
      application_date,
      job_link,
      notes,
      follow_up_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE applications
       SET company = $1,
           role = $2,
           status = $3,
           application_date = $4,
           job_link = $5,
           notes = $6,
           follow_up_date = $7
       WHERE id = $8
       RETURNING *`,
      [
        company,
        role,
        status,
        application_date || null,
        job_link || null,
        notes || null,
        follow_up_date || null,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
// DELETE application
app.delete("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 RETURNING *",
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});