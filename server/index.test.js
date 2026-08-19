const request = require("supertest");
const app = require("./index");
const pool = require("./db");

describe("POST /applications", () => {
  test("rejects missing company and role", async () => {
    const response = await request(app)
      .post("/applications")
      .send({
        company: "",
        role: "",
        status: "Applied",
        application_date: null,
        job_link: null,
        notes: null,
        follow_up_date: null,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "Company and role are required",
    });
  });
  test("rejects an invalid application status", async () => {
  const response = await request(app)
    .post("/applications")
    .send({
      company: "Test Company",
      role: "Developer",
      status: "Pending",
      application_date: null,
      job_link: null,
      notes: null,
      follow_up_date: null,
    });

  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    error: "Invalid application status",
  });
});
test("rejects a follow-up date earlier than application date", async () => {
  const response = await request(app)
    .post("/applications")
    .send({
      company: "Test Company",
      role: "Developer",
      status: "Applied",
      application_date: "2026-08-20",
      job_link: null,
      notes: null,
      follow_up_date: "2026-08-19",
    });

  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    error: "Follow-up date cannot be earlier than application date",
  });
});
    test("creates a new application successfully", async () => {
  const response = await request(app)
    .post("/applications")
    .send({
      company: "Test Company",
      role: "Backend Developer",
      status: "Applied",
      application_date: "2026-08-19",
      job_link: "https://example.com/job",
      notes: "Created by automated test",
      follow_up_date: "2026-08-25",
    });

  expect(response.statusCode).toBe(201);

  expect(response.body).toMatchObject({
    company: "Test Company",
    role: "Backend Developer",
    status: "Applied",
    job_link: "https://example.com/job",
    notes: "Created by automated test",
  });

  expect(response.body.id).toBeDefined();
});
test("creates an initial history record when an application is created", async () => {
  const response = await request(app)
    .post("/applications")
    .send({
      company: "History Test Company",
      role: "Frontend Developer",
      status: "Applied",
      application_date: "2026-08-19",
      job_link: null,
      notes: null,
      follow_up_date: "2026-08-25",
    });

  expect(response.statusCode).toBe(201);

  const historyResult = await pool.query(
    `SELECT status
     FROM application_history
     WHERE application_id = $1`,
    [response.body.id]
  );

  expect(historyResult.rows).toHaveLength(1);
  expect(historyResult.rows[0].status).toBe("Applied");
});
});
describe("PUT /applications/:id", () => {
  test("updates an application and records a status change", async () => {
    const createResponse = await request(app)
      .post("/applications")
      .send({
        company: "Update Test Company",
        role: "Software Engineer",
        status: "Applied",
        application_date: "2026-08-19",
        job_link: null,
        notes: null,
        follow_up_date: "2026-08-25",
      });

    const applicationId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/applications/${applicationId}`)
      .send({
        company: "Update Test Company",
        role: "Software Engineer",
        status: "Interview",
        application_date: "2026-08-19",
        job_link: null,
        notes: "Moved to interview stage",
        follow_up_date: "2026-08-25",
      });

    expect(updateResponse.statusCode).toBe(200);

    expect(updateResponse.body).toMatchObject({
      id: applicationId,
      status: "Interview",
      notes: "Moved to interview stage",
    });

    const historyResult = await pool.query(
      `SELECT status
       FROM application_history
       WHERE application_id = $1
       ORDER BY changed_at ASC`,
      [applicationId]
    );

    expect(historyResult.rows).toHaveLength(2);
    expect(historyResult.rows[0].status).toBe("Applied");
    expect(historyResult.rows[1].status).toBe("Interview");
  });
  test("does not create history when status does not change", async () => {
  const createResponse = await request(app)
    .post("/applications")
    .send({
      company: "No History Test",
      role: "Developer",
      status: "Applied",
      application_date: "2026-08-19",
      job_link: null,
      notes: null,
      follow_up_date: "2026-08-25",
    });

  const applicationId = createResponse.body.id;

  const updateResponse = await request(app)
    .put(`/applications/${applicationId}`)
    .send({
      company: "No History Test",
      role: "Developer",
      status: "Applied",
      application_date: "2026-08-19",
      job_link: null,
      notes: "Only notes were updated",
      follow_up_date: "2026-08-25",
    });

  expect(updateResponse.statusCode).toBe(200);

  const historyResult = await pool.query(
    `SELECT status
     FROM application_history
     WHERE application_id = $1`,
    [applicationId]
  );

  expect(historyResult.rows).toHaveLength(1);
  expect(historyResult.rows[0].status).toBe("Applied");
});
test("records a backward status transition", async () => {
  const createResponse = await request(app)
    .post("/applications")
    .send({
      company: "Backward Transition Test",
      role: "Developer",
      status: "Interview",
      application_date: "2026-08-19",
      job_link: null,
      notes: null,
      follow_up_date: "2026-08-25",
    });

  const applicationId = createResponse.body.id;

  const updateResponse = await request(app)
    .put(`/applications/${applicationId}`)
    .send({
      company: "Backward Transition Test",
      role: "Developer",
      status: "Applied",
      application_date: "2026-08-19",
      job_link: null,
      notes: "Moved back to applied stage",
      follow_up_date: "2026-08-25",
    });

  expect(updateResponse.statusCode).toBe(200);

  const historyResult = await pool.query(
    `SELECT status
     FROM application_history
     WHERE application_id = $1
     ORDER BY changed_at ASC`,
    [applicationId]
  );

  expect(historyResult.rows).toHaveLength(2);
  expect(historyResult.rows[0].status).toBe("Interview");
  expect(historyResult.rows[1].status).toBe("Applied");
});
});
describe("DELETE /applications/:id", () => {
  test("deletes an application and its history", async () => {
    const createResponse = await request(app)
      .post("/applications")
      .send({
        company: "Delete Test Company",
        role: "Developer",
        status: "Applied",
        application_date: "2026-08-19",
        job_link: null,
        notes: null,
        follow_up_date: "2026-08-25",
      });

    const applicationId = createResponse.body.id;

    const deleteResponse = await request(app).delete(
      `/applications/${applicationId}`
    );

    expect(deleteResponse.statusCode).toBe(200);

    const applicationResult = await pool.query(
      "SELECT * FROM applications WHERE id = $1",
      [applicationId]
    );

    expect(applicationResult.rows).toHaveLength(0);

    const historyResult = await pool.query(
      "SELECT * FROM application_history WHERE application_id = $1",
      [applicationId]
    );

    expect(historyResult.rows).toHaveLength(0);
  });
});
describe("GET /applications/:id/history", () => {
  test("returns application history", async () => {
    const createResponse = await request(app)
      .post("/applications")
      .send({
        company: "History Endpoint Test",
        role: "Developer",
        status: "Applied",
        application_date: "2026-08-19",
        job_link: null,
        notes: null,
        follow_up_date: "2026-08-25",
      });

    const applicationId = createResponse.body.id;

    const response = await request(app).get(
      `/applications/${applicationId}/history`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      application_id: applicationId,
      status: "Applied",
    });
  });

  test("rejects an invalid application ID", async () => {
    const response = await request(app).get(
      "/applications/abc/history"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid application ID",
    });
  });

  test("returns 404 for a missing application", async () => {
    const response = await request(app).get(
      "/applications/999999/history"
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: "Application not found",
    });
  });
});
afterEach(async () => {
  await pool.query("DELETE FROM applications");
});
afterAll(async () => {
  await pool.end();
});