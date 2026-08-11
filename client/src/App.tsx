import { useEffect, useState } from "react";

type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
  application_date: string | null;
  job_link: string | null;
  notes: string | null;
  follow_up_date: string | null;
};

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [applicationDate, setApplicationDate] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/applications")
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this application?");
if (!confirmed) return;
  await fetch(`http://localhost:3001/applications/${id}`, {
    method: "DELETE",
  });

  setApplications(
    applications.filter((application) => application.id !== id)
  );
};
  const handleEdit = (application: Application) => {
  setEditingId(application.id);
  setCompany(application.company);
  setRole(application.role);
  setStatus(application.status);
  setApplicationDate(application.application_date?.slice(0, 10) || "");
  setJobLink(application.job_link || "");
  setNotes(application.notes || "");
  setFollowUpDate(application.follow_up_date?.slice(0, 10) || "");
};
const handleCancelEdit = () => {
  setEditingId(null);
  setCompany("");
  setRole("");
  setStatus("Applied");
  setApplicationDate("");
  setJobLink("");
  setNotes("");
  setFollowUpDate("");
};
  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const url = editingId
    ? `http://localhost:3001/applications/${editingId}`
    : "http://localhost:3001/applications";

  const method = editingId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
      company,
      role,
      status,
      application_date: applicationDate,
      job_link: jobLink,
      notes,
      follow_up_date: followUpDate,
      }),
  });

    const newApplication = await response.json();

    if (editingId) {
  setApplications(
    applications.map((application) =>
      application.id === editingId ? newApplication : application
    )
  );
  setEditingId(null);
} else {
  setApplications([...applications, newApplication]);
}

    setCompany("");
    setRole("");
    setStatus("Applied");
    setApplicationDate("");
    setJobLink("");
    setNotes("");
    setFollowUpDate("");
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
        <input
        type="date"
        value={applicationDate}
        onChange={(event) => setApplicationDate(event.target.value)}
        />

        <input
        type="url"
        placeholder="Job Link"
        value={jobLink}
        onChange={(event) => setJobLink(event.target.value)}
        />

        <textarea
        placeholder="Notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        />

      <input
      type="date"
      value={followUpDate}
      onChange={(event) => setFollowUpDate(event.target.value)}
      />
        <button type="submit">
  {editingId ? "Update Application" : "Add Application"}
</button>
{editingId && (
  <button type="button" onClick={handleCancelEdit}>
    Cancel
  </button>
)}
      </form>

      {applications.map((application) => (
  <div key={application.id}>
    <h2>{application.company}</h2>

    <p>{application.role}</p>

    <p>Status: {application.status}</p>

    {application.application_date && (
      <p>
        Applied on:{" "}
        {new Date(application.application_date).toLocaleDateString()}
      </p>
    )}

    {application.job_link && (
      <p>
        <a
          href={application.job_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Job Posting
        </a>
      </p>
    )}

    {application.notes && (
      <p>Notes: {application.notes}</p>
    )}

    {application.follow_up_date && (
      <p>
        Follow up:{" "}
        {new Date(application.follow_up_date).toLocaleDateString()}
      </p>
    )}
    <button
    type="button"
    onClick={() => handleEdit(application)}
    >
  Edit
</button>
<button onClick={() => handleDelete(application.id)}>
  Delete
</button>
  </div>
))}
    </div>
  );
}

export default App;