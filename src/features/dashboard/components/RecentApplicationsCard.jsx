import { ListChecks, Plus } from "lucide-react";
import DashboardPagination from "./DashboardPagination.jsx";
import DashboardTitle from "./DashboardTitle.jsx";
import RecentApplicationItem from "./RecentApplicationItem.jsx";

function getVisibleRecentItems(recentItems, recentPage, recentAppsPerPage) {
  const startIndex = (recentPage - 1) * recentAppsPerPage;
  const endIndex = recentPage * recentAppsPerPage;

  return recentItems.slice(startIndex, endIndex);
}

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
  recentCardRef,
}) {
  const periodLabel = recentPeriod === "today" ? "Today" : "This Week";
  const totalPages = Math.max(
    1,
    Math.ceil(recentItems.length / recentAppsPerPage),
  );
  const visibleItems = getVisibleRecentItems(
    recentItems,
    recentPage,
    recentAppsPerPage,
  );

  return (
    <div
      ref={recentCardRef}
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
          visibleItems.map((item) => (
            <RecentApplicationItem key={item.id} item={item} />
          ))
        ) : (
          <p className="stat-card-description text-sm">
            No applications listed for {periodLabel.toLowerCase()}
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
