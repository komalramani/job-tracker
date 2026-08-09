const cors=require("cors");
const express = require("express");
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Job Tracker API is running");
});
let applications = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    status: "Applied",
  },
];

app.get("/applications", (req, res) => {
  res.json(applications);
});

app.post("/applications", (req, res) => {
  console.log("POST received:", req.body);

  const newApplication = {
    id: applications.length + 1,
    company: req.body.company,
    role: req.body.role,
    status: req.body.status,
  };

  applications.push(newApplication);

  res.status(201).json(newApplication);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});