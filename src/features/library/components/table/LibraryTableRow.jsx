import { getStatusMeta } from "../../constants/libraryStatuses.js";
import {
  formatLibraryAppliedDate,
  formatLibraryLocation,
  openLibraryJobUrl,
} from "../../utils/libraryDisplayFormatters.js";

function LibraryTableRow({ item, isPageReady, onItemClick, onTogglePinned }) {
  const statusMeta = getStatusMeta(item.status);
  const isClickable = isPageReady && onItemClick;

  function handleMiddleMouseDown(event) {
    if (event.button !== 1) return;

    event.preventDefault();
  }

  function handleMiddleClick(event) {
    if (event.button !== 1) return;

    event.preventDefault();
    event.stopPropagation();
    onTogglePinned?.(item);
  }

  function handleRowClick() {
    if (!isClickable) return;
    openLibraryJobUrl({ stopPropagation: () => {} }, item.jobUrl);
  }

  function handleContextMenu(event) {
    event.preventDefault();

    if (!isClickable) return;
    onItemClick(item);
  }

  return (
    <tr
      onClick={handleRowClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMiddleMouseDown}
      onAuxClick={handleMiddleClick}
      className={`library-table-row ${isClickable ? "is-clickable" : ""} ${
        item.pinned ? "is-pinned" : ""
      }`}
      title={
        item.pinned
          ? "Middle-click to unpin"
          : "Middle-click to pin this application"
      }
    >
      <td className="library-table-cell library-col-company">
        <span className="library-table-text-truncate">
          {item.company || "-"}
        </span>
      </td>

      <td className="library-table-cell library-col-role">
        <span className="library-table-text-truncate">{item.role || "-"}</span>
      </td>

      <td className="library-table-cell library-col-status">
        <span className="library-table-status-chip">
          <span>{statusMeta.emoji}</span>
          <span className="library-table-text-truncate">
            {statusMeta.label || "-"}
          </span>
        </span>
      </td>

      <td className="library-table-cell library-col-priority">
        <span className="library-table-priority-chip">
          {item.priority || "Medium"}
        </span>
      </td>

      <td className="library-table-cell library-col-location">
        <span className="library-table-text-truncate">
          {formatLibraryLocation(item.location)}
        </span>
      </td>

      <td className="library-table-cell library-col-added">
        <span className="library-table-text-nowrap">
          {formatLibraryAppliedDate(item.createdAt)}
        </span>
      </td>

      <td className="library-table-cell library-col-applied">
        <span className="library-table-text-nowrap">
          {formatLibraryAppliedDate(item.appliedAt)}
        </span>
      </td>

      <td className="library-table-cell library-col-job-id">
        <span className="library-table-text-truncate">{item.jobId || "-"}</span>
      </td>
    </tr>
  );
}

export default LibraryTableRow;
