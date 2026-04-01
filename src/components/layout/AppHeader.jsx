import { APP_NAME, APP_TAGLINE } from "../../constants/app.js";

function AppHeader() {
  return (
    <div className="mb-6 rounded-[28px] bg-white/55 px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
      <div>
        <p className="text-sm font-medium tracking-wide text-pink-400">
          {APP_NAME}
        </p>
        <h1 className="text-3xl font-semibold text-slate-800">
          {APP_TAGLINE}
        </h1>
      </div>
    </div>
  );
}

export default AppHeader;