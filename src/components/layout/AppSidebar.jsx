import { navigationItems } from "../../app/config/navigation.js";

function AppSidebar({ activePage, onNavigate }) {
  return (
    <div className="relative w-[72px]">
      <aside className="group/sidebar absolute left-0 top-0 z-30 w-[72px] overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-3 shadow-lg backdrop-blur-xl transition-[width,background-color,border-color,box-shadow] duration-300 ease-out hover:w-[180px]">
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
                    ? "bg-sky-200 text-slate-800 shadow-sm"
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
    </div>
  );
}

export default AppSidebar;
