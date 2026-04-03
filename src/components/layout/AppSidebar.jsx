import { navigationItems } from "../../app/config/navigation.js";

function AppSidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar-shell surface-card group/sidebar relative z-30">
      <div className="flex flex-col gap-4">
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
              className={`interactive flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium transition outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${
                isActive
                  ? "surface-control bg-sky-200 text-slate-800"
                  : "bg-white/50 text-slate-600 hover:bg-white/80"
              }`}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Icon size={18} />
              </div>

              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-200 ease-out group-hover/sidebar:max-w-[120px] group-hover/sidebar:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default AppSidebar;
