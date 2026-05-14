import { Filter, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

const EMPTY_COLUMN_FILTERS = {
  company: "all",
  role: "all",
  status: "all",
  priority: "all",
  location: "all",
  appliedAt: "",
};

function getUniqueOptions(items, key, fallbackLabel) {
  const uniqueValues = [
    ...new Set(
      items.map((item) => String(item[key] ?? "").trim()).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return [
    { value: "all", label: fallbackLabel },
    ...uniqueValues.map((value) => ({ value, label: value })),
  ];
}

function getActiveFilterCount(columnFilters, dateScope) {
  let count = dateScope !== "all" ? 1 : 0;

  Object.entries(columnFilters).forEach(([key, value]) => {
    if (value !== EMPTY_COLUMN_FILTERS[key]) count += 1;
  });

  return count;
}

function LibraryTableFilters({
  items = [],
  dateScope,
  onDateScopeChange,
  columnFilters,
  onColumnFiltersChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const activeFilterCount = getActiveFilterCount(columnFilters, dateScope);

  const companyOptions = useMemo(
    () => getUniqueOptions(items, "company", "All Companies"),
    [items],
  );

  const roleOptions = useMemo(
    () => getUniqueOptions(items, "role", "All Roles"),
    [items],
  );

  const locationOptions = useMemo(
    () => getUniqueOptions(items, "location", "All Locations"),
    [items],
  );

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function updateFilter(filterName, value) {
    onColumnFiltersChange((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  }

  function clearFilters() {
    onDateScopeChange("all");
    onColumnFiltersChange(EMPTY_COLUMN_FILTERS);
  }

  return (
    <div className="library-table-filter-menu-wrap" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className={`library-table-filter-trigger ${isOpen ? "is-open" : ""} ${
          activeFilterCount > 0 ? "has-active-filters" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Filter className="library-table-filter-trigger-icon" />
        <span>Filters</span>

        {activeFilterCount > 0 ? (
          <span className="library-table-filter-count">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="library-table-filter-menu" role="dialog">
          <div className="library-table-filter-menu-header">
            <p className="library-table-filter-title">Filters</p>

            <div className="library-table-filter-header-actions">
              <button
                type="button"
                onClick={clearFilters}
                className="library-table-filter-reset-button"
              >
                <RotateCcw className="library-table-filter-small-icon" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="library-table-filter-icon-button"
                aria-label="Close filters"
              >
                <X className="library-table-filter-small-icon" />
              </button>
            </div>
          </div>

          <div className="library-table-filter-grid">
            <label className="library-table-filter-field">
              <span>Range</span>
              <SelectMenu
                value={dateScope}
                onChange={onDateScopeChange}
                options={TABLE_DATE_SCOPE_OPTIONS}
                className="library-table-filter-select"
              />
            </label>

            <label className="library-table-filter-field">
              <span>Date</span>
              <input
                type="date"
                value={columnFilters.appliedAt}
                onChange={(event) =>
                  updateFilter("appliedAt", event.target.value)
                }
                className="input-base library-table-filter-input"
              />
            </label>

            <label className="library-table-filter-field">
              <span>Status</span>
              <SelectMenu
                value={columnFilters.status}
                onChange={(value) => updateFilter("status", value)}
                options={TABLE_STATUS_FILTER_OPTIONS}
                className="library-table-filter-select"
              />
            </label>

            <label className="library-table-filter-field">
              <span>Priority</span>
              <SelectMenu
                value={columnFilters.priority}
                onChange={(value) => updateFilter("priority", value)}
                options={TABLE_PRIORITY_FILTER_OPTIONS}
                className="library-table-filter-select"
              />
            </label>

            <label className="library-table-filter-field">
              <span>Company</span>
              <SelectMenu
                value={columnFilters.company}
                onChange={(value) => updateFilter("company", value)}
                options={companyOptions}
                className="library-table-filter-select"
              />
            </label>

            <label className="library-table-filter-field">
              <span>Role</span>
              <SelectMenu
                value={columnFilters.role}
                onChange={(value) => updateFilter("role", value)}
                options={roleOptions}
                className="library-table-filter-select"
              />
            </label>

            <label className="library-table-filter-field is-wide">
              <span>Location</span>
              <SelectMenu
                value={columnFilters.location}
                onChange={(value) => updateFilter("location", value)}
                options={locationOptions}
                className="library-table-filter-select"
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryTableFilters;
