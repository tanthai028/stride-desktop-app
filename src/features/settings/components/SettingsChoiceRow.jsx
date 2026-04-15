import { triggerPreviewFeedback } from "../../../lib/uiFeedback.js";

function SettingsChoiceRow({ title, description, value, options, onChange }) {
  async function handleChoiceClick(nextValue) {
    onChange(nextValue);
    await triggerPreviewFeedback(nextValue);
  }

  return (
    <div className="settings-card settings-card-padded">
      <div className="settings-card-header">
        <p className="settings-card-title">{title}</p>
        <p className="settings-card-description">{description}</p>
      </div>

      <div className="settings-choice-list">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChoiceClick(option.value)}
              aria-pressed={isSelected}
              className={`settings-choice-button ${isSelected ? "is-selected" : ""}`}
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
