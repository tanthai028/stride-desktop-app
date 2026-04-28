import HeaderClock from "./HeaderClock.jsx";

function AppHeader({ eyebrow, title, description }) {
  return (
    <div className="app-header">
      <div className="app-header-brand app-header-brand-responsive app-header-brand-mask surface-card relative">
        <div className="app-header-brand-copy">
          <p className="app-header-kicker text-sm font-medium tracking-wide">
            {eyebrow}
          </p>

          <h1 className="app-header-title text-3xl font-semibold">{title}</h1>

          {description ? (
            <p className="app-header-description">{description}</p>
          ) : null}
        </div>
      </div>

      <HeaderClock />
    </div>
  );
}

export default AppHeader;
