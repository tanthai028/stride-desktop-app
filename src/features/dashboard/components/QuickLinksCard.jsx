import { Check, ExternalLink, Link, Plus, Trash2 } from "lucide-react";
import DashboardPagination from "./DashboardPagination.jsx";
import DashboardTitle from "./DashboardTitle.jsx";
import { QUICK_LINKS_PER_PAGE } from "./dashboardPreview.constants.js";
import { getFaviconUrl, openDashboardLink } from "./dashboardPreview.utils.js";

function QuickLinksCard({
  quickLinks,
  currentPage,
  isEditingLinks,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onPageChange,
  onStartEditing,
  onStopEditing,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(quickLinks.length / QUICK_LINKS_PER_PAGE),
  );
  const visibleLinks = quickLinks.slice(
    (currentPage - 1) * QUICK_LINKS_PER_PAGE,
    currentPage * QUICK_LINKS_PER_PAGE,
  );

  return (
    <div
      className="surface-card dashboard-card dashboard-quick-links-card dashboard-clickable-card"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!isEditingLinks) onStartEditing();
      }}
      onKeyDown={(event) => {
        if (isEditingLinks) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onStartEditing();
        }
      }}
    >
      <div className="dashboard-card-header dashboard-quick-links-header">
        <p className="stat-card-description dashboard-card-title text-sm font-medium">
          <DashboardTitle icon={Link}>Quick Links</DashboardTitle>
        </p>

        {isEditingLinks ? (
          <div className="dashboard-quick-links-actions">
            <button
              type="button"
              className="dashboard-icon-action"
              onClick={(event) => {
                event.stopPropagation();
                onAddLink();
              }}
              aria-label="Add quick link"
              title="Add link"
            >
              <Plus />
            </button>

            <button
              type="button"
              className="dashboard-icon-action"
              onClick={(event) => {
                event.stopPropagation();
                onStopEditing();
              }}
              aria-label="Done editing quick links"
              title="Done"
            >
              <Check />
            </button>
          </div>
        ) : null}
      </div>

      <div className="dashboard-quick-links-list">
        {isEditingLinks ? (
          <div className="dashboard-quick-links-edit-header" aria-hidden="true">
            <span>Name</span>
            <span>Link</span>
            <span />
          </div>
        ) : null}

        {visibleLinks.map((link) => {
          const faviconUrl = getFaviconUrl(link.url);

          return (
            <div key={link.id} className="dashboard-quick-link-row">
              {isEditingLinks ? (
                <>
                  <input
                    aria-label="Quick link label"
                    value={link.label}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) =>
                      onUpdateLink(link.id, "label", event.target.value)
                    }
                  />

                  <input
                    aria-label="Quick link URL"
                    value={link.url}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) =>
                      onUpdateLink(link.id, "url", event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="dashboard-icon-action dashboard-quick-link-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveLink(link.id);
                    }}
                    aria-label={`Remove ${link.label || "quick link"}`}
                    title="Remove"
                  >
                    <Trash2 />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="dashboard-quick-link-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openDashboardLink(link.url);
                  }}
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
                    <ExternalLink />
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <DashboardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default QuickLinksCard;
