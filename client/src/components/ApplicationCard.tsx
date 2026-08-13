import type { Application } from "../types/application";
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