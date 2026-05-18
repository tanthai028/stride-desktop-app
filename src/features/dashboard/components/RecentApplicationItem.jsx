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
      <p className="dashboard-recent-title">
        <img
          className="dashboard-company-icon"
          src={getCompanyIconUrl(item.company)}
          onError={(event) => handleCompanyIconFallback(event, item.jobUrl)}
          alt=""
          loading="lazy"
        />

        <span className="dashboard-recent-title-text">
          {item.company || "Untitled Company"} · {item.role || "Untitled Role"}
        </span>
      </p>

      <div className="dashboard-recent-meta">
        <span className="dashboard-recent-location">
          {item.location || "Unknown"}
        </span>

        <span className="dashboard-recent-right">
          {statusMeta.displayLabel || statusMeta.label} -{" "}
          {formatLibraryAppliedDate(item.appliedAt)}
        </span>
      </div>
    </button>
  );
}

export default RecentApplicationItem;
