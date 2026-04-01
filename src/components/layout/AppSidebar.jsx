import { navigationItems } from "../../constants/navigation.js";

function AppSidebar({ activePage, onNavigate }) {
  return (
    <aside className="rounded-[28px] border border-white/60 bg-white/55 p-3 shadow-lg backdrop-blur-xl">
      <p className="text-center mb-3 px-2 text-sm font-medium text-slate-400">
        Navigate
      </p>

      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = item.id === activePage;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`interactive w-full rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-sky-200 text-slate-800 shadow-sm"
                  : "bg-white/50 text-slate-600 hover:bg-white/80"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default AppSidebar;
