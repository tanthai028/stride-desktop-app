function StartupSplash() {
  return (
    <div className="startup-screen flex min-h-screen items-center justify-center">
      <div className="startup-panel surface-panel rounded-[28px] px-8 py-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✨</div>

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
