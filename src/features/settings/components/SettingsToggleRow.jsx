function SettingsToggleRow({ title, description, checked, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/50 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl transition hover:shadow-[0_14px_36px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={checked}
          className={`interactive relative mt-1 h-7 w-12 rounded-full border transition ${
            checked
              ? "border-sky-400/70 bg-sky-400 shadow-[0_4px_16px_rgba(56,189,248,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]"
              : "border-white/50 bg-white/40 shadow-[0_4px_14px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full transition ${
              checked
                ? "left-6 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.18)]"
                : "left-1 bg-white/95 shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default SettingsToggleRow;
