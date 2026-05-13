function StartupSplash() {
  return (
    <div className="startup-screen">
      <div className="startup-panel surface-panel rounded-[28px] backdrop-blur-xl">
        <div className="startup-panel-content">
          <img src="/stride_icon.png" alt="" className="startup-icon" />

          <div>
            <p className="startup-title text-sm font-semibold">
              Launching Stride
            </p>
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
