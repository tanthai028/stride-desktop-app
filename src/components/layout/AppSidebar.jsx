import { navigationItems } from "../../constants/navigation.js";

function AppSidebar({ activePage, onNavigate }) {
  return (
    <aside className="rounded-[28px] border border-white/60 bg-white/55 p-4 shadow-lg backdrop-blur-xl">
      <p className="mb-3 px-2 text-sm font-medium text-slate-400">Navigate</p>

      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = item.id === activePage;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`interactive w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-pink-200 text-slate-800 shadow-sm"
                  : "bg-white/50 text-slate-600 hover:bg-white/80"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default AppSidebar;