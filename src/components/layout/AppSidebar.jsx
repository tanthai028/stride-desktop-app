import { navigationItems } from "../../app/config/navigation.js";
import { getHoverFeedbackHandlers } from "../../lib/uiFeedback.js";

function AppSidebar({ activePage, onNavigate }) {
  const hoverFeedbackHandlers = getHoverFeedbackHandlers();

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
        </div>
      </aside>
    </div>
  );
}

export default AppSidebar;
