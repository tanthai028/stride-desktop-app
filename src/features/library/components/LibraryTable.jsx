import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from "lucide-react";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import { getStatusMeta } from "../constants/libraryStatuses.js";

function formatAppliedDate(appliedAt) {
  if (!appliedAt) return "-";

  const parsedDate = new Date(appliedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
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
              />
              <SortableHeader
                label="Role"
                columnKey="role"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Status"
                columnKey="status"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Location"
                columnKey="location"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Applied"
                columnKey="appliedAt"
                currentSortValue={sortValue}
                onSortChange={onSortChange}
              />
              <th className="library-table-header-cell">Job Post</th>
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
                  <td className="library-table-cell">{item.company || "-"}</td>
                  <td className="library-table-cell">{item.role || "-"}</td>
                  <td className="library-table-cell">
                    <span className="library-table-status-chip">
                      <span>{statusMeta.emoji}</span>
                      <span>{statusMeta.label || "-"}</span>
                    </span>
                  </td>
                  <td className="library-table-cell">{item.location || "-"}</td>
                  <td className="library-table-cell">
                    {formatAppliedDate(item.appliedAt)}
                  </td>
                  <td className="library-table-cell">
                    {item.jobUrl ? (
                      <button
                        type="button"
                        onClick={(event) => openJobUrl(event, item.jobUrl)}
                        className="library-table-link-button"
                      >
                        <ExternalLink className="library-table-link-icon" />
                        <span>Open</span>
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
