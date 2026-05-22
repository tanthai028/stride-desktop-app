import { PictureInPicture2 } from "lucide-react";
import { navigationItems } from "../../app/config/navigation.js";
import { getHoverFeedbackHandlers } from "../../lib/uiFeedback.js";
import { openApplyModeWindow } from "../../lib/windowControls.js";

function AppSidebar({ activePage, onNavigate, unappliedCount = 0 }) {
  const hoverFeedbackHandlers = getHoverFeedbackHandlers();
  const hasUnapplied = unappliedCount > 0;
  const displayCount = unappliedCount > 99 ? "99+" : String(unappliedCount);

  return (
    <div className="sidebar-rail">
      <aside className="sidebar-shell">
        <div className="sidebar-list">
          {navigationItems.map((item) => {
            const isActive = item.id === activePage;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={(event) => {
                  event.currentTarget.blur();
                  onNavigate(item.id);
                }}
                className={`sidebar-item ${isActive ? "is-active" : ""}`}
                {...hoverFeedbackHandlers}
              >
                <div className="sidebar-item-inner">
                  <div className="sidebar-icon">
                    {item.iconSrc ? (
                      <img
                        src={item.iconSrc}
                        alt=""
                        className={
                          item.id === "dashboard"
                            ? "sidebar-icon-image sidebar-icon-image--stride"
                            : "sidebar-icon-image"
                        }
                      />
                    ) : (
                      <Icon size="1.125rem" />
                    )}
                  </div>

                  <span className="sidebar-label">{item.label}</span>
                </div>
              </button>
            );
          })}

          <div className="sidebar-apply-mode-divider" />

          <button
            type="button"
            className={`sidebar-apply-mode-item ${hasUnapplied ? "has-unapplied" : ""}`}
            onClick={openApplyModeWindow}
            {...hoverFeedbackHandlers}
          >
            <div className="sidebar-item-inner">
              <div className="sidebar-icon">
                <PictureInPicture2 size="1.125rem" />
                <span className="sidebar-apply-mode-pulse" />
              </div>
              <span className="sidebar-label">
                <span className="sidebar-apply-mode-label-text">
                  Apply Mode
                </span>
                {hasUnapplied && (
                  <span
                    className="sidebar-apply-mode-count"
                    aria-label={`${unappliedCount} unapplied`}
                  >
                    {displayCount}
                  </span>
                )}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default AppSidebar;
