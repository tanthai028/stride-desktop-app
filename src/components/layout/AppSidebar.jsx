import { navigationItems } from "../../app/config/navigation.js";

const sidebarItemBase =
  "group/sidebar sidebar-item interactive flex min-h-11 w-full items-center overflow-hidden rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

const sidebarItemActive = "sidebar-item-active";
const sidebarItemIdle = "";

const sidebarItemInner =
  "flex w-full items-center gap-0 transition-all duration-200 group-hover/sidebar:gap-3";

const sidebarIconWrap = "flex h-5 w-5 shrink-0 items-center justify-center";

const sidebarLabel =
  "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 ease-out group-hover/sidebar:max-w-[200px] group-hover/sidebar:opacity-100";

function AppSidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar-shell group/sidebar relative z-30 p-3">
      <div className="flex flex-col gap-3">
        {navigationItems.map((item) => {
          const isActive = item.id === activePage;
          const Icon = item.icon;
          const buttonStateClass = isActive
            ? sidebarItemActive
            : sidebarItemIdle;

          return (
            <button
              key={item.id}
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();
                onNavigate(item.id);
              }}
              className={`${sidebarItemBase} ${buttonStateClass}`}
            >
              <div className={sidebarItemInner}>
                <div className={sidebarIconWrap}>
                  <Icon size={18} />
                </div>

                <span className={sidebarLabel}>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default AppSidebar;
