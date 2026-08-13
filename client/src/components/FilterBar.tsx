type FilterBarProps = {
  searchTerm: string;
  statusFilter: string;
  sortOrder: string;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setSortOrder: (value: string) => void;
  handleClearFilters: () => void;
};

function FilterBar({
  searchTerm,
  statusFilter,
  sortOrder,
  setSearchTerm,
  setStatusFilter,
  setSortOrder,
  handleClearFilters,
}: FilterBarProps) {
return (
<div>
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
</div>
);
}

export default FilterBar;