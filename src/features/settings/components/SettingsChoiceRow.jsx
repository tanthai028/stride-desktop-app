import { triggerPreviewFeedback } from "../../../lib/uiFeedback.js";

function SettingsChoiceRow({ title, description, value, options, onChange }) {
  async function handleChoiceClick(nextValue) {
    onChange(nextValue);
    await triggerPreviewFeedback(nextValue);
  }

  return (
    <div className="rounded-2xl border border-white/40 bg-white/35 px-4 py-3 backdrop-blur-xl">
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
              onClick={() => handleChoiceClick(option.value)}
              aria-pressed={isSelected}
              className={`interactive surface-control rounded-xl border px-3 py-2 text-xs font-medium transition ${
                isSelected
                  ? "border-white/50 bg-white/50 text-sky-600 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.16),0_0_14px_rgba(56,189,248,0.12)]"
                  : "border-white/30 bg-white/25 text-slate-600 hover:bg-white/40"
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
