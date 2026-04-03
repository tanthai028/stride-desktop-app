import { APP_NAME, APP_TAGLINE } from "../../constants/app.js";
import HeaderClock from "./HeaderClock.jsx";

function AppHeader({ settings }) {
  const isDark = settings?.darkMode;

  return (
    <div className="flex w-full items-start justify-between gap-4">
      <div
        className="app-header-brand surface-card relative min-w-0 flex-1"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 30%, rgba(0,0,0,0.9) 60%, transparent 80%)",
          maskImage:
            "linear-gradient(to right, black 30%, rgba(0,0,0,0.9) 60%, transparent 80%)",
        }}
      >
        <div className="relative z-10">
          <p className="text-sm font-medium tracking-wide text-sky-500">
            {APP_NAME}
          </p>

          <h1
            className={`text-3xl font-semibold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            {APP_TAGLINE}
          </h1>
        </div>
      </div>

      <HeaderClock isDark={isDark} />
    </div>
  );
}

export default AppHeader;
