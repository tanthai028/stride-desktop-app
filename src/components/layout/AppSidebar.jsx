import { navigationItems } from "../../app/config/navigation.js";

function AppSidebar({ activePage, onNavigate }) {
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
              >
                <div className="sidebar-item-inner">
                  <div className="sidebar-icon">
                    <Icon size={18} />
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
