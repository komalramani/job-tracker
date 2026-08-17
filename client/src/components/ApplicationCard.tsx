import type { Application } from "../types/application";
import { useState } from "react";
import { getApplicationHistory } from "../services/applicationService";
import type { ApplicationHistory } from "../types/applicationHistory";
type ApplicationCardProps = {
  application: Application;
  handleEdit: (application: Application) => void;
  handleDelete: (id: number) => void;
};
function ApplicationCard({
  application,
  handleEdit,
  handleDelete,
}: ApplicationCardProps) {
  const [history, setHistory] = useState<ApplicationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const handleHistoryClick = async () => {
  // If history is already open, just close it
  if (showHistory) {
    setShowHistory(false);
    return;
  }
  setShowHistory(true);
  try {
    setIsHistoryLoading(true);

    const data = await getApplicationHistory(application.id);
    setHistory(data);
  } catch (error) {
    console.error("Failed to load application history:", error);
  } finally {
    setIsHistoryLoading(false);
  }
};
  return (
    <div className="application-card">
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

    {application.follow_up_date && (() => {
  const followUpDate = new Date(application.follow_up_date);
  const today = new Date();

  followUpDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const isOverdue = followUpDate < today;
  const isDueToday = followUpDate.getTime() === today.getTime();
  
  return (
    <p
      className={
        isOverdue
          ? "follow-up overdue"
          : isDueToday
          ? "follow-up due-today"
          : "follow-up upcoming"
      }
    >
      Follow up: {followUpDate.toLocaleDateString()}
      {isOverdue && " — Overdue"}
      {isDueToday && " — Due today"}
    </p>
  );
})()}
<button
  type="button"
  className="history-button"
  onClick={handleHistoryClick}
>
  {showHistory ? "Hide History" : "View History"}
</button>
{showHistory && (
  <div className="application-history">
    <h3>Application History</h3>

    {isHistoryLoading ? (
      <p className="history-message">Loading history...</p>
    ) : history.length === 0 ? (
      <p className="history-message">No history recorded yet.</p>
    ) : (
      <div className="history-list">
        {history.map((item) => (
          <div className="history-item" key={item.id}>
            <div className="history-dot" />
            <div>
              <strong>{item.status}</strong>
              <span>
                {new Date(item.changed_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
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
  );
}

export default ApplicationCard;