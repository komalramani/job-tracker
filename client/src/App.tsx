import { useEffect, useState } from "react";

type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
};

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  useEffect(() => {
    fetch("http://localhost:3001/applications")
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3001/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        status,
      }),
    });

    const newApplication = await response.json();

    setApplications([...applications, newApplication]);

    setCompany("");
    setRole("");
    setStatus("Applied");
  };

  return (
    <div>
      <h1>Job Application Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button type="submit">Add Application</button>
      </form>

      {applications.map((application) => (
        <div key={application.id}>
          <h2>{application.company}</h2>
          <p>{application.role}</p>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;