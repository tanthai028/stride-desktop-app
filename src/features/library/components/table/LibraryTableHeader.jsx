import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { libraryTableColumns } from "../../config/libraryTableColumns.js";

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
  sortable = true,
}) {
  const [activeKey, activeDirection] = String(currentSortValue).split("-");
  const isActive = activeKey === columnKey;
  const nextSortValue = getNextSortValue(currentSortValue, columnKey);

  function handleClick() {
    if (!sortable) return;
    onSortChange(nextSortValue);
  }

  return (
    <th className={`library-table-header-cell ${className}`}>
      {sortable ? (
        <button
          type="button"
          onClick={handleClick}
          className={`library-table-sort-button ${isActive ? "is-active" : ""}`}
        >
          <span>{label}</span>
          {renderSortIcon(isActive, activeDirection)}
        </button>
      ) : (
        <span className="library-table-header-label">{label}</span>
      )}
    </th>
  );
}

function LibraryTableHeader({ sortValue, onSortChange }) {
  return (
    <thead>
      <tr className="library-table-header-row">
        {libraryTableColumns.map((column) => (
          <SortableHeader
            key={column.columnKey}
            label={column.label}
            columnKey={column.columnKey}
            currentSortValue={sortValue}
            onSortChange={onSortChange}
            className={column.className}
            sortable={column.sortable !== false}
          />
        ))}

        <th className="library-table-header-cell library-col-open">
          <span className="library-open-label-full">Job Post</span>
          <span className="library-open-label-compact">Open</span>
        </th>
      </tr>
    </thead>
  );
}

export default LibraryTableHeader;
