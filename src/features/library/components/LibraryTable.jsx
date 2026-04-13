import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from "lucide-react";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import { getStatusMeta } from "../constants/libraryStatuses.js";

const STATE_ABBREVIATIONS = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function formatLocation(location) {
  if (!location) return "-";

  // Expecting "City, State"
  const parts = location.split(",").map((p) => p.trim());

  if (parts.length !== 2) return location;

  const [city, state] = parts;
  const shortState = STATE_ABBREVIATIONS[state];

  if (!shortState) return location;

  return `${city}, ${shortState}`;
}

function formatAppliedDate(appliedAt) {
  if (!appliedAt) return "-";

  const parsedDate = new Date(appliedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

function openJobUrl(event, jobUrl) {
  event.stopPropagation();

  if (!jobUrl) return;

  if (window.libraryApi?.openExternalUrl) {
    window.libraryApi.openExternalUrl(jobUrl);
    return;
  }

  window.open(jobUrl, "_blank", "noopener,noreferrer");
}

function getNextSortValue(currentSortValue, columnKey) {
  const [activeKey, activeDirection] = String(currentSortValue).split("-");

  if (activeKey !== columnKey) {
    return `${columnKey}-asc`;
  }

  return `${columnKey}-${activeDirection === "asc" ? "desc" : "asc"}`;
}

function renderSortIcon(isActive, direction) {
  if (!isActive) {
    return <ArrowUpDown className="library-table-sort-icon" />;
  }

  if (direction === "asc") {
    return <ArrowUp className="library-table-sort-icon" />;
  }

  return <ArrowDown className="library-table-sort-icon" />;
}

function SortableHeader({
  label,
  columnKey,
  currentSortValue,
  onSortChange,
  className = "",
}) {
  const [activeKey, activeDirection] = String(currentSortValue).split("-");
  const isActive = activeKey === columnKey;
  const nextSortValue = getNextSortValue(currentSortValue, columnKey);

  function handleClick() {
    onSortChange(nextSortValue);
  }

  return (
    <th className={`library-table-header-cell ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className={`library-table-sort-button ${isActive ? "is-active" : ""}`}
      >
        <span>{label}</span>
        {renderSortIcon(isActive, activeDirection)}
      </button>
    </th>
  );
}

function LibraryTable({
  items,
  isPageReady,
  onItemClick,
  sortValue,
  onSortChange,
}) {
  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
  } = usePageScrollbar();

  return (
    <div className="library-table-shell">
      <div className="library-width-debug">
        {Math.round(scrollRef.current?.offsetWidth || 0)}px
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="library-table-scroll scrollbar-hide"
      >
        <table className="library-table">
          <thead>
            <tr className="library-table-header-row">
              <SortableHeader
                label="Company"
                columnKey="company"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
                className="library-col-company"
              />
              <SortableHeader
                label="Role"
                columnKey="role"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
                className="library-col-role"
              />
              <SortableHeader
                label="Status"
                columnKey="status"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
                className="library-col-status"
              />
              <SortableHeader
                label="Location"
                columnKey="location"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
                className="library-col-location"
              />
              <SortableHeader
                label="Applied"
                columnKey="appliedAt"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
                className="library-col-applied"
              />
              <th className="library-table-header-cell library-col-open">
                <span className="library-open-label-full">Job Post</span>
                <span className="library-open-label-compact">Open</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const statusMeta = getStatusMeta(item.status);
              const isClickable = isPageReady && onItemClick;

              return (
                <tr
                  key={item.id}
                  onClick={isClickable ? () => onItemClick(item) : undefined}
                  className={`library-table-row ${
                    isClickable ? "is-clickable" : ""
                  }`}
                >
                  <td className="library-table-cell library-col-company">
                    <span className="library-table-text-truncate">
                      {item.company || "-"}
                    </span>
                  </td>

                  <td className="library-table-cell library-col-role">
                    <span className="library-table-text-truncate">
                      {item.role || "-"}
                    </span>
                  </td>

                  <td className="library-table-cell library-col-status">
                    <span className="library-table-status-chip">
                      <span>{statusMeta.emoji}</span>
                      <span className="library-table-text-truncate">
                        {statusMeta.label || "-"}
                      </span>
                    </span>
                  </td>

                  <td className="library-table-cell library-col-location">
                    <span className="library-table-text-truncate">
                      {formatLocation(item.location)}
                    </span>
                  </td>

                  <td className="library-table-cell library-col-applied">
                    <span className="library-table-text-nowrap">
                      {formatAppliedDate(item.appliedAt)}
                    </span>
                  </td>

                  <td className="library-table-cell library-col-open">
                    {item.jobUrl ? (
                      <button
                        type="button"
                        onClick={(event) => openJobUrl(event, item.jobUrl)}
                        className="library-table-link-button"
                        aria-label={`Open job post for ${item.company || item.role || "application"}`}
                        title="Open job post"
                      >
                        <ExternalLink className="library-table-link-icon" />
                        <span className="library-open-text">Open</span>
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PageScrollbar
        isVisible={isScrollbarVisible}
        scrollMetrics={scrollMetrics}
      />
    </div>
  );
}

export default LibraryTable;
