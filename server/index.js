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

// GET status history for one application
app.get("/applications/:id/history", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, application_id, status, changed_at
       FROM application_history
       WHERE application_id = $1
       ORDER BY changed_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch application history" });
  }
});

// POST to PostgreSQL
app.post("/applications", async (req, res) => {
  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const {
      company,
      role,
      status,
      application_date,
      job_link,
      notes,
      follow_up_date,
    } = req.body;

    const result = await client.query(
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

    const newApplication = result.rows[0];

    await client.query(
      `INSERT INTO application_history (application_id, status)
       VALUES ($1, $2)`,
      [newApplication.id, newApplication.status]
    );

    await client.query("COMMIT");

    res.status(201).json(newApplication);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error(error);
    res.status(500).json({ error: "Database error" });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// UPDATE application
app.put("/applications/:id", async (req, res) => {
  let client;

  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const { id } = req.params;

    // Get current status before updating
    const currentResult = await client.query(
      "SELECT status FROM applications WHERE id = $1",
      [id]
    );

    if (currentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Application not found" });
    }

    const currentStatus = currentResult.rows[0].status;

    const {
      company,
      role,
      status,
      application_date,
      job_link,
      notes,
      follow_up_date,
    } = req.body;

    // Update application
    const result = await client.query(
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

    // Record history only when status actually changes
    if (currentStatus !== status) {
      await client.query(
        `INSERT INTO application_history (application_id, status)
         VALUES ($1, $2)`,
        [id, status]
      );
    }

    // Everything succeeded
    await client.query("COMMIT");

    res.json(result.rows[0]);
  } catch (error) {
    // Undo everything if any database operation fails
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error(error);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Return the database connection to the pool
    if (client) {
      client.release();
    }
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