function SettingsToggleRow({
  title,
  description,
  checked,
  onToggle,
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-white/60 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`interactive relative mt-1 h-7 w-12 rounded-full transition ${
          checked ? "bg-pink-300" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default SettingsToggleRow;