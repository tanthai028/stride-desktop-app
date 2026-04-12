import { triggerPreviewFeedback } from "../../../lib/uiFeedback.js";

function SettingsChoiceRow({ title, description, value, options, onChange }) {
  async function handleChoiceClick(nextValue) {
    onChange(nextValue);
    await triggerPreviewFeedback(nextValue);
  }

  return (
    <div className="settings-card rounded-2xl px-4 py-3">
      <div className="mb-3">
        <p className="settings-card-title text-sm font-semibold">{title}</p>
        <p className="settings-card-description mt-1 text-xs">{description}</p>
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
              className={`settings-choice-button rounded-xl px-3 py-2 text-xs font-medium ${
                isSelected ? "is-selected" : ""
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
