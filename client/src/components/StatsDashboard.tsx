type StatsDashboardProps = {
  totalApplications: number;
  appliedCount: number;
  interviewCount: number;
  offerCount: number;
  rejectedCount: number;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
};

function StatsDashboard({
  totalApplications,
  appliedCount,
  interviewCount,
  offerCount,
  rejectedCount,
  statusFilter,
  setStatusFilter,
}: StatsDashboardProps) {
  return (
    <div className="stats-grid">
  <div
  className={`stat-card total-stat ${
  statusFilter === "All" ? "active-stat" : ""
}`}
  onClick={() => setStatusFilter("All")}
>
    <span>Total</span>
    <strong>{totalApplications}</strong>
  </div>

  <div
  className={`stat-card applied-stat ${
  statusFilter === "Applied" ? "active-stat" : ""
}`}
  onClick={() => setStatusFilter("Applied")}
>
  <span>Applied</span>
  <strong>{appliedCount}</strong>
</div>

  <div
  className={`stat-card interview-stat ${
  statusFilter === "Interview" ? "active-stat" : ""
}`}
  onClick={() => setStatusFilter("Interview")}
>
    <span>Interviews</span>
    <strong>{interviewCount}</strong>
  </div>

  <div
  className={`stat-card offer-stat ${
  statusFilter === "Offer" ? "active-stat" : ""
}`}
  onClick={() => setStatusFilter("Offer")}
>
    <span>Offers</span>
    <strong>{offerCount}</strong>
  </div>

  <div
  className={`stat-card rejected-stat ${
  statusFilter === "Rejected" ? "active-stat" : ""
}`}
  onClick={() => setStatusFilter("Rejected")}
>
    <span>Rejected</span>
    <strong>{rejectedCount}</strong>
  </div>
</div>
  );
}

export default StatsDashboard;