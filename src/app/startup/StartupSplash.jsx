function StartupSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="surface-panel rounded-[28px] bg-white/70 px-8 py-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✨</div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Launching app
            </p>
            <p className="text-xs text-slate-500">
              Getting everything ready...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupSplash;
