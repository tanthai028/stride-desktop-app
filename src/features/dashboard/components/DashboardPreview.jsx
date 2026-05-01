import { useEffect, useState } from "react";
import { formatLibraryAppliedDate } from "../../library/utils/libraryDisplayFormatters.js";
import { getStatusMeta } from "../../library/constants/libraryStatuses.js";

const APPLY_GOAL_STORAGE_KEY = "dashboardApplyGoalTarget";
const QUICK_LINKS_STORAGE_KEY = "dashboardQuickLinks";

const DEFAULT_APPLY_GOAL_TARGET = 3;
const DEFAULT_QUICK_LINKS = [
  {
    id: "job-sheet",
    label: "Job Tracker Sheet",
    url: "https://docs.google.com/spreadsheets/",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    url: "https://leetcode.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/",
  },
];

function IconButton({ type }) {
  const paths = {
    edit: "M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",
    done: "M20 6 9 17l-5-5",
    add: "M12 5v14 M5 12h14",
    remove: "M3 6h18 M8 6V4h8v2 M6 6l1 14h10l1-14",
    open: "M7 17 17 7 M9 7h8v8",
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[type]} />
    </svg>
  );
}

function getSavedApplyGoalTarget() {
  const savedTarget = Number(localStorage.getItem(APPLY_GOAL_STORAGE_KEY));

  return Number.isFinite(savedTarget) && savedTarget > 0
    ? savedTarget
    : DEFAULT_APPLY_GOAL_TARGET;
}

function getSavedQuickLinks() {
  try {
    const savedLinks = JSON.parse(
      localStorage.getItem(QUICK_LINKS_STORAGE_KEY),
    );

    return Array.isArray(savedLinks) && savedLinks.length > 0
      ? savedLinks
      : DEFAULT_QUICK_LINKS;
  } catch {
    return DEFAULT_QUICK_LINKS;
  }
}

function normalizeUrl(url) {
  const trimmedUrl = String(url || "").trim();

  if (!trimmedUrl) return "";

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

function getFaviconUrl(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return "";

  try {
    const { origin } = new URL(normalizedUrl);

    return `${origin}/favicon.ico`;
  } catch {
    return "";
  }
}

function openDashboardLink(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return;

  if (window.libraryApi?.openExternalUrl) {
    window.libraryApi.openExternalUrl(normalizedUrl);
    return;
  }

  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}

function DashboardPreview({
  variant = "applyGoal",
  todayApplicationCount = 0,
  recentItems = [],
  onRecentApplicationsClick,
}) {
  const [applyGoalTarget, setApplyGoalTarget] = useState(
    getSavedApplyGoalTarget,
  );
  const [quickLinks, setQuickLinks] = useState(getSavedQuickLinks);
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  useEffect(() => {
    localStorage.setItem(APPLY_GOAL_STORAGE_KEY, String(applyGoalTarget));
  }, [applyGoalTarget]);

  useEffect(() => {
    localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(quickLinks));
  }, [quickLinks]);

  const applyGoalProgress = Math.min(
    100,
    Math.round((todayApplicationCount / applyGoalTarget) * 100),
  );

  const updateQuickLink = (linkId, field, value) => {
    setQuickLinks((links) =>
      links.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link,
      ),
    );
  };

  const addQuickLink = () => {
    setQuickLinks((links) => [
      ...links,
      {
        id: `link-${Date.now()}`,
        label: "New Link",
        url: "https://",
      },
    ]);

    setIsEditingLinks(true);
  };

  const removeQuickLink = (linkId) => {
    setQuickLinks((links) =>
      links.length > 1 ? links.filter((link) => link.id !== linkId) : links,
    );
  };

  if (variant === "recentApplications") {
    return (
      <button
        type="button"
        className="surface-card dashboard-card dashboard-recent-card dashboard-clickable-card"
        onClick={onRecentApplicationsClick}
      >
        <p className="stat-card-description dashboard-card-title text-sm font-medium">
          Recent Applications
        </p>

        <div className="dashboard-recent-list">
          {recentItems.length > 0 ? (
            recentItems.map((item) => {
              const statusMeta = getStatusMeta(item.status);

              return (
                <div key={item.id} className="dashboard-recent-item">
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
                </div>
              );
            })
          ) : (
            <p className="stat-card-description text-sm">
              No applications yet.
            </p>
          )}
        </div>
      </button>
    );
  }

  if (variant === "quickLinks") {
    return (
      <div className="surface-card dashboard-card dashboard-quick-links-card">
        <div className="dashboard-card-header dashboard-quick-links-header">
          <p className="stat-card-description dashboard-card-title text-sm font-medium">
            Quick Links
          </p>

          <div className="dashboard-quick-links-actions">
            {isEditingLinks ? (
              <button
                type="button"
                className="dashboard-icon-action"
                onClick={addQuickLink}
                aria-label="Add quick link"
                title="Add link"
              >
                <IconButton type="add" />
              </button>
            ) : null}
            <button
              type="button"
              className="dashboard-icon-action"
              onClick={() => setIsEditingLinks((current) => !current)}
              aria-label={
                isEditingLinks ? "Done editing quick links" : "Edit quick links"
              }
              title={isEditingLinks ? "Done" : "Edit"}
            >
              <IconButton type={isEditingLinks ? "done" : "edit"} />
            </button>
          </div>
        </div>

        <div className="dashboard-quick-links-list">
          {quickLinks.map((link) => {
            const faviconUrl = getFaviconUrl(link.url);

            return (
              <div key={link.id} className="dashboard-quick-link-row">
                {isEditingLinks ? (
                  <>
                    <label className="dashboard-quick-link-field">
                      <span className="dashboard-quick-link-input-label">
                        Name
                      </span>
                      <input
                        aria-label="Quick link label"
                        value={link.label}
                        onChange={(event) =>
                          updateQuickLink(link.id, "label", event.target.value)
                        }
                      />
                    </label>

                    <label className="dashboard-quick-link-field">
                      <span className="dashboard-quick-link-input-label">
                        Link
                      </span>
                      <input
                        aria-label="Quick link URL"
                        value={link.url}
                        onChange={(event) =>
                          updateQuickLink(link.id, "url", event.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="dashboard-icon-action dashboard-quick-link-delete"
                      onClick={() => removeQuickLink(link.id)}
                      aria-label={`Remove ${link.label || "quick link"}`}
                      title="Remove"
                    >
                      <IconButton type="remove" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="dashboard-quick-link-button"
                    onClick={() => openDashboardLink(link.url)}
                  >
                    <span className="dashboard-quick-link-main">
                      <span className="dashboard-quick-link-site-icon">
                        {faviconUrl ? (
                          <img
                            src={faviconUrl}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="dashboard-quick-link-fallback-icon">
                            {link.label?.charAt(0)?.toUpperCase() || "L"}
                          </span>
                        )}
                      </span>

                      <span className="dashboard-quick-link-label">
                        {link.label || "Untitled Link"}
                      </span>
                    </span>

                    <span className="dashboard-quick-link-open-icon">
                      <IconButton type="open" />
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card stat-card dashboard-metric-card dashboard-apply-goal-card">
      <div className="dashboard-metric-content">
        <div className="dashboard-apply-goal-header">
          <p className="stat-card-label stat-card-label--sky">Daily Goal</p>

          <input
            aria-label="Daily application goal target"
            className="dashboard-apply-goal-input"
            type="number"
            min="1"
            value={applyGoalTarget}
            onChange={(event) => {
              const nextTarget = Number(event.target.value);

              setApplyGoalTarget(
                Number.isFinite(nextTarget) && nextTarget > 0 ? nextTarget : 1,
              );
            }}
          />
        </div>

        <h2 className="stat-card-title dashboard-metric-value">
          {todayApplicationCount}/{applyGoalTarget}
        </h2>

        <p className="stat-card-description dashboard-metric-description">
          Apply to {applyGoalTarget} jobs
        </p>

        <div className="dashboard-status-chart-track dashboard-apply-goal-track">
          <div
            className="dashboard-status-chart-fill dashboard-status-chart-fill--sky"
            style={{ width: `${applyGoalProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
