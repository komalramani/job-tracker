import "./App.css";
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
  fetch("http://localhost:3001/applications")
    .then((response) => response.json())
    .then((data) => setApplications(data))
    .catch((error) => {

  console.error("Error:", error);

  setLoadError(true);

})
    .finally(() => setIsLoading(false));
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
const filteredApplications = applications
  .filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    const dateA = a.application_date
      ? new Date(a.application_date).getTime()
      : 0;

    const dateB = b.application_date
      ? new Date(b.application_date).getTime()
      : 0;

    return sortOrder === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });
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

  if (!company.trim() || !role.trim()) {

    alert("Please enter both company and role.");

    return;

  }
  setIsSaving(true);
  try {

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

    if (!response.ok) {

      throw new Error("Failed to save application");

    }

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
  }
  catch (error) {

  console.error(error);

  alert("Something went wrong while saving the application.");

}
finally {

  setIsSaving(false);

}

};

  return (
  <div className="app-container">
    <h1>Job Application Tracker</h1>
    <input
  className="search-input"
  type="text"
  placeholder="Search by company or role..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>
<select
  className="status-filter"
  value={statusFilter}
  onChange={(event) => setStatusFilter(event.target.value)}
>
  <option value="All">All Statuses</option>
  <option value="Applied">Applied</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select>
<select
  className="sort-select"
  value={sortOrder}
  onChange={(event) => setSortOrder(event.target.value)}
>
  <option value="newest">Newest first</option>
  <option value="oldest">Oldest first</option>
</select>
<button
  type="button"
  className="clear-filters-button"
  onClick={() => {
    setSearchTerm("");
    setStatusFilter("All");
    setSortOrder("newest");
  }}
>
  Clear Filters
</button>
      <form className="application-form" onSubmit={handleSubmit}>
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
        <button type="submit" disabled={isSaving}>
  {isSaving
    ? "Saving..."
    : editingId
    ? "Update Application"
    : "Add Application"}
</button>
{editingId && (
  <button type="button" onClick={handleCancelEdit}>
    Cancel
  </button>
)}
      </form>
{isLoading && <p>Loading applications...</p>}
{loadError && (
  <p>Unable to load applications. Please try again.</p>
)}
{!isLoading &&
  !loadError &&
  searchTerm &&
  filteredApplications.length === 0 && (
    <p>No matching applications found.</p>
  )}
{!isLoading &&
  !loadError &&
  !searchTerm &&
  applications.length === 0 && (
  <p>No applications yet. Add your first application!</p>
)}
      <div className="applications-grid">

{!isLoading && filteredApplications.map((application) => (

    <div className="application-card" key={application.id}>
    <h2 className="company-name">{application.company}</h2>
    <p className="role-name">{application.role}</p>

    <p>
  <span className={`status-badge status-${application.status.toLowerCase()}`}>
    {application.status}
  </span>
</p>

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
    <button className="edit-button" onClick={() => handleEdit(application)}>
  Edit
</button>

<button
  className="delete-button"
  onClick={() => handleDelete(application.id)}
>
  Delete
</button>
  </div>
))}
    </div>
    </div>
  );
}
export default App;