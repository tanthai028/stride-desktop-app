import { getStatusMeta } from "../../constants/libraryStatuses.js";
import {
  formatLibraryAppliedDate,
  formatLibraryLocation,
} from "../../utils/libraryDisplayFormatters.js";

const AVATAR_COLORS = [
  "avatar-sky",
  "avatar-violet",
  "avatar-emerald",
  "avatar-amber",
  "avatar-rose",
  "avatar-indigo",
];

function getAvatarColor(company = "") {
  const code = company.trim().toLowerCase().charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function LibraryTableRow({ item, isPageReady, onItemClick, onTogglePinned }) {
  const statusMeta = getStatusMeta(item.status);
  const isClickable = isPageReady && onItemClick;
  const priorityClass = (item.priority || "medium").toLowerCase();
  const avatarLetter = item.company?.trim()?.[0]?.toUpperCase() || "?";
  const avatarColor = getAvatarColor(item.company);

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
    onItemClick(item);
  }

  return (
    <tr
      onClick={handleRowClick}
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
        <span className="library-table-company-cell">
          <span className={`library-table-avatar ${avatarColor}`}>
            {avatarLetter}
          </span>
          <span className="library-table-text-truncate">
            {item.company || "-"}
          </span>
        </span>
      </td>

      <td className="library-table-cell library-col-role">
        <span className="library-table-text-truncate">{item.role || "-"}</span>
      </td>

      <td className="library-table-cell library-col-status">
        <span className={`library-table-status-chip status-${statusMeta.value}`}>
          <span className="chip-emoji">{statusMeta.emoji}</span>
          <span className="library-table-text-truncate">
            {statusMeta.label || "-"}
          </span>
        </span>
      </td>

      <td className="library-table-cell library-col-priority">
        <span className={`library-table-priority-chip priority-${priorityClass}`}>
          <span className="priority-dot" />
          <span>{item.priority || "Medium"}</span>
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
    </tr>
  );
}

export default LibraryTableRow;
