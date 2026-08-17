import "./App.css";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import FilterBar from "./components/FilterBar";
import { useEffect, useState } from "react";
import StatsDashboard from "./components/StatsDashboard";
import {
  getApplications,
  saveApplication,
} from "./services/applicationService";

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
  getApplications()
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
  const totalApplications = applications.length;

const appliedCount = applications.filter(

  (application) => application.status === "Applied"

).length;

const interviewCount = applications.filter(

  (application) => application.status === "Interview"

).length;

const offerCount = applications.filter(

  (application) => application.status === "Offer"

).length;

const rejectedCount = applications.filter(

  (application) => application.status === "Rejected"

).length;
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

    const newApplication = await saveApplication(
  {
    company,
    role,
    status,
    application_date: applicationDate || null,
    job_link: jobLink || null,
    notes: notes || null,
    follow_up_date: followUpDate || null,
  },
  editingId
);

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
  const handleClearFilters = () => {
  setSearchTerm("");
  setStatusFilter("All");
  setSortOrder("newest");
};
  return (
<div className="app-container">
  <header className="app-header">
  <h1>Job Application Tracker</h1>
  <p>Manage applications, track progress, and stay on top of follow-ups.</p>
</header>
  <StatsDashboard
  totalApplications={totalApplications}
  appliedCount={appliedCount}
  interviewCount={interviewCount}
  offerCount={offerCount}
  rejectedCount={rejectedCount}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
/>
<FilterBar
  searchTerm={searchTerm}
  statusFilter={statusFilter}
  sortOrder={sortOrder}
  setSearchTerm={setSearchTerm}
  setStatusFilter={setStatusFilter}
  setSortOrder={setSortOrder}
  handleClearFilters={handleClearFilters}
/>
  <ApplicationForm
  company={company}
  role={role}
  status={status}
  applicationDate={applicationDate}
  jobLink={jobLink}
  notes={notes}
  followUpDate={followUpDate}
  editingId={editingId}
  isSaving={isSaving}
  setCompany={setCompany}
  setRole={setRole}
  setStatus={setStatus}
  setApplicationDate={setApplicationDate}
  setJobLink={setJobLink}
  setNotes={setNotes}
  setFollowUpDate={setFollowUpDate}
  handleSubmit={handleSubmit}
  handleCancelEdit={handleCancelEdit}
/>
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
  
       <ApplicationCard

        key={application.id}

        application={application}

        handleEdit={handleEdit}

        handleDelete={handleDelete}

      />

))}
    </div>
    </div>
  );
}
export default App;