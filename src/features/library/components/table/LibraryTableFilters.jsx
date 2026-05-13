import SelectMenu from "../../../../components/ui/SelectMenu.jsx";
import { PRIORITY_OPTIONS } from "../../constants/libraryPriorities.js";
import { getLibraryStatusOptions } from "../../constants/libraryStatuses.js";

const TABLE_DATE_SCOPE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "all", label: "All" },
];

const TABLE_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  ...getLibraryStatusOptions().map((option) => ({
    value: option.value,
    label: option.rawLabel ?? option.label,
  })),
];

const TABLE_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All Priority" },
  ...PRIORITY_OPTIONS,
];

function LibraryTableFilters({
  dateScope,
  onDateScopeChange,
  columnFilters,
  onColumnFiltersChange,
}) {
  function updateFilter(filterName, value) {
    onColumnFiltersChange((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  }

  return (
    <div className="library-table-filters">
      <SelectMenu
        value={dateScope}
        onChange={onDateScopeChange}
        options={TABLE_DATE_SCOPE_OPTIONS}
        className="library-table-filter-select"
      />

      <input
        value={columnFilters.company}
        onChange={(e) => updateFilter("company", e.target.value)}
        placeholder="Company"
        className="input-base library-table-filter-input"
      />
      <input
        value={columnFilters.role}
        onChange={(e) => updateFilter("role", e.target.value)}
        placeholder="Role"
        className="input-base library-table-filter-input"
      />

      <SelectMenu
        value={columnFilters.status}
        onChange={(value) => updateFilter("status", value)}
        options={TABLE_STATUS_FILTER_OPTIONS}
        className="library-table-filter-select"
      />
      <SelectMenu
        value={columnFilters.priority}
        onChange={(value) => updateFilter("priority", value)}
        options={TABLE_PRIORITY_FILTER_OPTIONS}
        className="library-table-filter-select"
      />

      <input
        value={columnFilters.location}
        onChange={(e) => updateFilter("location", e.target.value)}
        placeholder="Location"
        className="input-base library-table-filter-input"
      />
      <input
        value={columnFilters.appliedAt}
        onChange={(e) => updateFilter("appliedAt", e.target.value)}
        placeholder="Applied date"
        className="input-base library-table-filter-input"
      />
    </div>
  );
}

export default LibraryTableFilters;
