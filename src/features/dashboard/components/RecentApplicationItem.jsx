import { ExternalLink } from "lucide-react";
import { formatLibraryAppliedDate } from "../../library/utils/libraryDisplayFormatters.js";
import { getStatusMeta } from "../../library/constants/libraryStatuses.js";
import { openDashboardLink } from "../utils/dashboardPreview.utils.js";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../utils/companyIcon.utils.js";

function RecentApplicationItem({ item }) {
  const statusMeta = getStatusMeta(item.status);

  return (
    <button
      type="button"
      className="dashboard-recent-item"
      onClick={(event) => {
        event.stopPropagation();
        openDashboardLink(item.jobUrl);
      }}
      disabled={!item.jobUrl}
    >
      <span className="dashboard-recent-main">
        <span className="dashboard-recent-company-row">
          <img
            className="dashboard-company-icon"
            src={getCompanyIconUrl(item.company)}
            onError={(event) => handleCompanyIconFallback(event, item.jobUrl)}
            alt=""
            loading="lazy"
          />
          <strong className="dashboard-recent-company-name">
            {item.company || "Untitled Company"}
          </strong>
        </span>
        <span className="dashboard-recent-role-text">
          {item.role || "Untitled Role"}
        </span>
        <em className="dashboard-recent-location-em">
          {item.location || " "}
        </em>
      </span>

      <span className="dashboard-recent-side">
        <span className="dashboard-recent-date-text">
          {formatLibraryAppliedDate(item.appliedAt)}
        </span>
        <span className="dashboard-recent-status-chip">
          {statusMeta.displayLabel || statusMeta.label}
          <ExternalLink />
        </span>
      </span>
    </button>
  );
}

export default RecentApplicationItem;
