function SettingsChoiceRow({ title, description, value, options, onChange }) {
  return (
    <div className="rounded-2xl bg-white/60 px-4 py-3">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`interactive surface-control rounded-xl px-3 py-2 text-xs font-medium transition ${
                isSelected
                  ? "bg-violet-200 text-slate-900"
                  : "bg-white/70 text-slate-600 hover:bg-white/90"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsChoiceRow;
