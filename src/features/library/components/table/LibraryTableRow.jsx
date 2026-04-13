import { ExternalLink } from "lucide-react";
import { getStatusMeta } from "../../constants/libraryStatuses.js";
import {
  formatAppliedDate,
  formatLocation,
  openJobUrl,
} from "../../utils/libraryTableFormatters.js";

function LibraryTableRow({ item, isPageReady, onItemClick }) {
  const statusMeta = getStatusMeta(item.status);
  const isClickable = isPageReady && onItemClick;

  return (
    <tr
      onClick={isClickable ? () => onItemClick(item) : undefined}
      className={`library-table-row ${isClickable ? "is-clickable" : ""}`}
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
}

export default LibraryTableRow;
