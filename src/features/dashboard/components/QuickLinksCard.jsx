import { ChevronLeft, ChevronRight, ExternalLink, Link, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DashboardTitle from "./DashboardTitle.jsx";
import {
  getFaviconUrl,
  openDashboardLink,
} from "../utils/dashboardPreview.utils.js";

function QuickLinksCard({
  quickLinks,
  currentPage,
  quickLinksPerPage,
  isEditingLinks,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onPageChange,
  onStartEditing,
  onStopEditing,
  quickLinksListRef,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(quickLinks.length / quickLinksPerPage),
  );
  const visibleLinks = quickLinks.slice(
    (currentPage - 1) * quickLinksPerPage,
    currentPage * quickLinksPerPage,
  );
  const cardRef = useRef(null);

  const stopEditingLinks = () => {
    onStopEditing();

    if (cardRef.current?.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    cardRef.current?.blur();
  };

  useEffect(() => {
    if (!isEditingLinks) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        stopEditingLinks();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isEditingLinks, stopEditingLinks]);

  return (
    <motion.div
      ref={cardRef}
      className="surface-card dashboard-card dashboard-quick-links-card dashboard-clickable-card"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: 0.05 }}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (isEditingLinks) {
          stopEditingLinks();
          return;
        }

        onStartEditing();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isEditingLinks) {
          event.preventDefault();
          stopEditingLinks();
          return;
        }

        if (!isEditingLinks && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onStartEditing();
        }
      }}
    >
      <div className="dashboard-card-header dashboard-quick-links-header">
        <p className="stat-card-description dashboard-card-title text-sm font-medium">
          <DashboardTitle icon={Link}>Quick Links</DashboardTitle>
        </p>

        <div className="dashboard-quick-links-actions">
          {totalPages > 1 && (
            <>
              <button
                type="button"
                className="dashboard-icon-action"
                onClick={(event) => {
                  event.stopPropagation();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                className="dashboard-icon-action"
                onClick={(event) => {
                  event.stopPropagation();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {isEditingLinks && (
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
          )}
        </div>
      </div>

      <div ref={quickLinksListRef} className="dashboard-quick-links-list">
        {visibleLinks.map((link) => {
          const faviconUrl = getFaviconUrl(link.url);

          return (
            <div key={link.id} className="dashboard-quick-link-row">
              {isEditingLinks ? (
                <>
                  <input
                    aria-label="Quick link label"
                    placeholder="Name"
                    value={link.label}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) =>
                      onUpdateLink(link.id, "label", event.target.value)
                    }
                  />

                  <input
                    aria-label="Quick link URL"
                    placeholder="https://example.com"
                    value={link.url}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
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

    </motion.div>
  );
}

export default QuickLinksCard;
