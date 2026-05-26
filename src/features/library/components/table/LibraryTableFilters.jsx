import { CalendarDays, Filter, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Calendar from "../../../../components/ui/Calendar.jsx";
import SelectMenu from "../../../../components/ui/SelectMenu.jsx";
import {
  EMPTY_TABLE_COLUMN_FILTERS,
  TABLE_DATE_SCOPE_OPTIONS,
  TABLE_PRIORITY_FILTER_OPTIONS,
  TABLE_STATUS_FILTER_OPTIONS,
} from "../../constants/tableFilterOptions.js";

const PANEL_EXIT_DURATION_MS = 150;

function getEmptyColumnFilters() {
  return {
    ...EMPTY_TABLE_COLUMN_FILTERS,
    company: [...EMPTY_TABLE_COLUMN_FILTERS.company],
    role: [...EMPTY_TABLE_COLUMN_FILTERS.role],
    status: [...EMPTY_TABLE_COLUMN_FILTERS.status],
    priority: [...EMPTY_TABLE_COLUMN_FILTERS.priority],
    location: [...EMPTY_TABLE_COLUMN_FILTERS.location],
  };
}

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
    if (key === "appliedAt") {
      if (value) count += 1;
      return;
    }

    if (Array.isArray(value) && !value.includes("all")) {
      count += 1;
    }
  });

  return count;
}

function formatDateDisplay(ymd) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function LibraryTableFilters({
  items = [],
  dateScope,
  onDateScopeChange,
  columnFilters,
  onColumnFiltersChange,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dateCalOpen, setDateCalOpen] = useState(false);

  const menuRef = useRef(null);
  const dateCalWrapRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isOpenRef = useRef(false);

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
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        closeMenu();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") closeMenu();
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!dateCalWrapRef.current?.contains(event.target)) {
        setDateCalOpen(false);
      }
    }
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function openMenu() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    isOpenRef.current = true;
    setIsClosing(false);
    setIsOpen(true);
    setIsMounted(true);
  }

  function closeMenu() {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;
    setIsOpen(false);
    setIsClosing(true);
    setDateCalOpen(false);
    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      setIsMounted(false);
      closeTimeoutRef.current = null;
    }, PANEL_EXIT_DURATION_MS);
  }

  function toggleMenu() {
    if (isOpenRef.current) closeMenu();
    else openMenu();
  }

  function updateFilter(filterName, value) {
    onColumnFiltersChange((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  }

  function clearFilters() {
    onDateScopeChange("all");
    onColumnFiltersChange(getEmptyColumnFilters());
  }

  const panelClassName = [
    "ltf-panel",
    isOpen && "is-open",
    isClosing && "is-closing",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ltf-wrap" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className={`ltf-trigger${isOpen ? " is-open" : ""}${activeFilterCount > 0 ? " has-filters" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Filter className="ltf-trigger-icon" />
        <span>Filters</span>

        {activeFilterCount > 0 ? (
          <span className="ltf-trigger-badge">{activeFilterCount}</span>
        ) : null}
      </button>

      {isMounted ? (
        <div className={panelClassName} role="dialog" aria-label="Filters">
          <div className="ltf-header">
            <span className="ltf-header-title">Filters</span>

            <button
              type="button"
              onClick={clearFilters}
              className="ltf-reset-btn"
              disabled={activeFilterCount === 0}
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>

          <div className="ltf-grid">
            <label className="ltf-field">
              <span className="ltf-field-label">Range</span>
              <SelectMenu
                value={dateScope}
                onChange={onDateScopeChange}
                options={TABLE_DATE_SCOPE_OPTIONS}
                className="ltf-select"
              />
            </label>

            <div className="ltf-field">
              <span className="ltf-field-label">Date</span>
              <div className="ltf-date-wrap" ref={dateCalWrapRef}>
                <button
                  type="button"
                  className={`ltf-date-trigger${dateCalOpen ? " is-open" : ""}`}
                  onClick={() => setDateCalOpen((v) => !v)}
                  aria-expanded={dateCalOpen}
                >
                  <CalendarDays size={13} className="ltf-date-trigger-icon" />
                  <span
                    className={`ltf-date-trigger-label${!columnFilters.appliedAt ? " is-placeholder" : ""}`}
                  >
                    {columnFilters.appliedAt
                      ? formatDateDisplay(columnFilters.appliedAt)
                      : "Pick a date"}
                  </span>
                  {columnFilters.appliedAt ? (
                    <button
                      type="button"
                      className="ltf-date-clear"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateFilter("appliedAt", "");
                      }}
                      aria-label="Clear date"
                    >
                      <X size={11} />
                    </button>
                  ) : null}
                </button>

                {dateCalOpen ? (
                  <div className="cal-popover">
                    <Calendar
                      value={columnFilters.appliedAt || undefined}
                      onChange={(v) => {
                        updateFilter("appliedAt", v);
                        setDateCalOpen(false);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <label className="ltf-field">
              <span className="ltf-field-label">Status</span>
              <SelectMenu
                value={columnFilters.status}
                onChange={(value) => updateFilter("status", value)}
                options={TABLE_STATUS_FILTER_OPTIONS}
                className="ltf-select"
                closeMenuOnSelect={false}
              />
            </label>

            <label className="ltf-field">
              <span className="ltf-field-label">Priority</span>
              <SelectMenu
                value={columnFilters.priority}
                onChange={(value) => updateFilter("priority", value)}
                options={TABLE_PRIORITY_FILTER_OPTIONS}
                className="ltf-select"
                closeMenuOnSelect={false}
              />
            </label>

            <label className="ltf-field">
              <span className="ltf-field-label">Company</span>
              <SelectMenu
                value={columnFilters.company}
                onChange={(value) => updateFilter("company", value)}
                options={companyOptions}
                className="ltf-select"
                closeMenuOnSelect={false}
              />
            </label>

            <label className="ltf-field">
              <span className="ltf-field-label">Role</span>
              <SelectMenu
                value={columnFilters.role}
                onChange={(value) => updateFilter("role", value)}
                options={roleOptions}
                className="ltf-select"
                closeMenuOnSelect={false}
              />
            </label>

            <label className="ltf-field is-wide">
              <span className="ltf-field-label">Location</span>
              <SelectMenu
                value={columnFilters.location}
                onChange={(value) => updateFilter("location", value)}
                options={locationOptions}
                className="ltf-select"
                closeMenuOnSelect={false}
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryTableFilters;
