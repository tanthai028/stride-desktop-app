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
          title={label}
        >
          {renderSortIcon(isActive, activeDirection)}
          <span className="library-table-sort-label">{label}</span>
        </button>
      ) : (
        <span className="library-table-header-label" title={label}>
          {label}
        </span>
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
      </tr>
    </thead>
  );
}

export default LibraryTableHeader;
