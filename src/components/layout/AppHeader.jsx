import { APP_NAME, APP_TAGLINE } from "../../constants/app.js";
import HeaderClock from "./HeaderClock.jsx";

function AppHeader() {
  return (
    <div className="app-header">
      <div className="app-header-brand app-header-brand-responsive app-header-brand-mask surface-card relative">
        <div className="app-header-brand-copy">
          <p className="app-header-kicker text-sm font-medium tracking-wide">
            {APP_NAME}
          </p>

          <h1 className="app-header-title text-3xl font-semibold">
            {APP_TAGLINE}
          </h1>
        </div>
      </div>

      <HeaderClock />
    </div>
  );
}

export default AppHeader;
