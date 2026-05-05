import { ListChecks, Plus } from "lucide-react";
import { formatLibraryAppliedDate } from "../../library/utils/libraryDisplayFormatters.js";
import { getStatusMeta } from "../../library/constants/libraryStatuses.js";
import DashboardPagination from "./DashboardPagination.jsx";
import DashboardTitle from "./DashboardTitle.jsx";
import { openDashboardLink } from "./dashboardPreview.utils.js";

function RecentApplicationsCard({
  recentItems,
  recentPeriod,
  recentPage,
  recentAppsPerPage,
  recentListRef,
  onRecentPeriodClick,
  onRecentApplicationsClick,
  onAddApplicationClick,
  onPageChange,
}) {
  const periodLabel = recentPeriod === "today" ? "Today" : "This Week";
  const totalPages = Math.max(
    1,
    Math.ceil(recentItems.length / recentAppsPerPage),
  );
  const visibleItems = recentItems.slice(
    (recentPage - 1) * recentAppsPerPage,
    recentPage * recentAppsPerPage,
  );

  return (
    <div
      className="surface-card dashboard-card dashboard-recent-card dashboard-clickable-card"
      role="button"
      tabIndex={0}
      onClick={onRecentApplicationsClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onRecentApplicationsClick?.();
        }
      }}
    >
      <div className="dashboard-recent-header">
        <p className="stat-card-description dashboard-card-title dashboard-recent-card-title text-sm font-medium">
          <DashboardTitle icon={ListChecks}>Recent Applications</DashboardTitle>{" "}
          <span className="dashboard-recent-count-chip">
            {recentItems.length}
          </span>
        </p>

        <button
          type="button"
          className="dashboard-recent-period-button"
          onClick={(event) => {
            event.stopPropagation();
            onRecentPeriodClick?.();
          }}
        >
          {periodLabel}
        </button>
      </div>

      <div ref={recentListRef} className="dashboard-recent-list">
        {recentItems.length > 0 ? (
          visibleItems.map((item) => {
            const statusMeta = getStatusMeta(item.status);

            return (
              <button
                key={item.id}
                type="button"
                className="dashboard-recent-item"
                onClick={(event) => {
                  event.stopPropagation();
                  openDashboardLink(item.jobUrl);
                }}
                disabled={!item.jobUrl}
              >
                <p className="dashboard-recent-title">
                  {item.company || "Untitled Company"} ·{" "}
                  {item.role || "Untitled Role"}
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
          })
        ) : (
          <p className="stat-card-description text-sm">
            No applications listed for {periodLabel.toLowerCase()}.
          </p>
        )}
      </div>

      <div className="dashboard-recent-pagination-slot">
        <DashboardPagination
          currentPage={recentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <button
        type="button"
        className="dashboard-recent-add-button"
        onClick={(event) => {
          event.stopPropagation();
          onAddApplicationClick?.();
        }}
        aria-label="Add application"
        title="Add application"
      >
        <Plus />
      </button>
    </div>
  );
}

export default RecentApplicationsCard;
