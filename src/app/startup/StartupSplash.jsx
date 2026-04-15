function StartupSplash() {
  return (
    <div className="startup-screen">
      <div className="startup-panel surface-panel rounded-[28px] backdrop-blur-xl">
        <div className="startup-panel-content">
          <div className="startup-icon">✨</div>

          <div>
            <p className="startup-title text-sm font-semibold">Launching app</p>
            <p className="startup-description text-xs">
              Getting everything ready...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupSplash;
