import { APP_NAME, APP_TAGLINE } from "../../constants/app.js";

function AppHeader({ settings }) {
  const isDark = settings?.darkMode;

  return (
    <div className="w-full">
      <div
        className="relative max-w-[600px] overflow-hidden rounded-[28px] border border-white/40 bg-white/45 px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 30%, rgba(0,0,0,0.9) 60%, transparent 80%)",
          maskImage:
            "linear-gradient(to right, black 30%, rgba(0,0,0,0.9) 60%, transparent 80%)",
        }}
      >
        <div className="relative z-10">
          <p className="text-sm font-medium tracking-wide text-pink-400">
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
    </div>
  );
}

export default AppHeader;
