function SettingsToggleRow({ title, description, checked, onToggle }) {
  return (
    <div className="settings-card settings-card-padded">
      <div className="settings-toggle-row">
        <div>
          <p className="settings-card-title">{title}</p>
          <p className="settings-card-description">{description}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={checked}
          className={`settings-toggle ${checked ? "is-checked" : ""}`}
        >
          <span
            className={`settings-toggle-thumb ${checked ? "is-checked" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

export default SettingsToggleRow;
