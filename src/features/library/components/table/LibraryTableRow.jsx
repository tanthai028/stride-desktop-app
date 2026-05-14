import { ExternalLink } from "lucide-react";
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

  return (
    <tr
      onClick={isClickable ? () => onItemClick(item) : undefined}
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

      <td className="library-table-cell library-col-applied">
        <span className="library-table-text-nowrap">
          {formatLibraryAppliedDate(item.appliedAt)}
        </span>
      </td>

      <td className="library-table-cell library-col-open">
        {item.jobUrl ? (
          <button
            type="button"
            onClick={(event) => openLibraryJobUrl(event, item.jobUrl)}
            className="library-table-link-button"
            aria-label={`Open job post for ${
              item.company || item.role || "application"
            }`}
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
}

export default LibraryTableRow;
