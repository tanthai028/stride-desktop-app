function StartupSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-[28px] border border-white/30 bg-white/70 px-8 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
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
