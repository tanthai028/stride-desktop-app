function SettingsPage({ settings, updateSetting, resetSettings }) {
  return (
    <div className="rounded-[36px] border border-white/50 bg-white/45 p-5 shadow-[0_20px_80px_rgba(180,180,255,0.12)] backdrop-blur-3xl">
      <div>
        <p className="text-sm font-medium text-pink-400">Settings</p>
        <h2 className="text-2xl font-semibold text-slate-800">
          App Preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage template behavior and local preferences.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-start justify-between gap-4 rounded-2xl bg-white/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Animations</p>
            <p className="mt-1 text-xs text-slate-500">
              Turn entrance animations on or off.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateSetting("animationsEnabled", !settings.animationsEnabled)
            }
            aria-pressed={settings.animationsEnabled}
            className={`relative mt-1 h-7 w-12 rounded-full transition ${
              settings.animationsEnabled ? "bg-pink-300" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                settings.animationsEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-2xl bg-white/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Compact mode</p>
            <p className="mt-1 text-xs text-slate-500">
              Use slightly tighter spacing in the main content area.
            </p>
          </div>

          <button
            type="button"
            onClick={() => updateSetting("compactMode", !settings.compactMode)}
            aria-pressed={settings.compactMode}
            className={`relative mt-1 h-7 w-12 rounded-full transition ${
              settings.compactMode ? "bg-pink-300" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                settings.compactMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={resetSettings}
          className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;