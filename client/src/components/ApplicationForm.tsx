import type React from "react";
type ApplicationFormProps = {
  company: string;
  role: string;
  status: string;
  applicationDate: string;
  jobLink: string;
  notes: string;
  followUpDate: string;
  editingId: number | null;
  isSaving: boolean;

  setCompany: (value: string) => void;
  setRole: (value: string) => void;
  setStatus: (value: string) => void;
  setApplicationDate: (value: string) => void;
  setJobLink: (value: string) => void;
  setNotes: (value: string) => void;
  setFollowUpDate: (value: string) => void;

  handleSubmit: (event: React.FormEvent) => void;
  handleCancelEdit: () => void;
};

function ApplicationForm({
  company,
  role,
  status,
  applicationDate,
  jobLink,
  notes,
  followUpDate,
  editingId,
  isSaving,
  setCompany,
  setRole,
  setStatus,
  setApplicationDate,
  setJobLink,
  setNotes,
  setFollowUpDate,
  handleSubmit,
  handleCancelEdit,
}: ApplicationFormProps) {
  return (
    
      <form className="application-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Add Application</h2>
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
        <div className="form-field">
  <label htmlFor="application-date">Application Date</label>
  <input
    id="application-date"
    type="date"
    value={applicationDate}
    onChange={(event) => setApplicationDate(event.target.value)}
  />
</div>

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

      <div className="form-field">
  <label htmlFor="follow-up-date">Follow-up Date</label>
  <input
    id="follow-up-date"
    type="date"
    value={followUpDate}
    onChange={(event) => setFollowUpDate(event.target.value)}
  />
</div>
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
  );
}

export default ApplicationForm;